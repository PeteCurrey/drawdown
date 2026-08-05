"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { phases } from "@/data/courses";

const LOCAL_STORAGE_KEY = "ddt_curriculum_progress_v1";

export interface ProgressItem {
  phaseSlug: string;
  moduleNumber: number;
  completed: boolean;
  quizScore: number | null;
  quizPassed: boolean;
  completedAt: string | null;
}

export interface PhaseProgress {
  phaseSlug: string;
  phaseName: string;
  totalModules: number;
  completedModules: number;
  percentage: number;
  isFullyCompleted: boolean;
}

export interface NextModule {
  phaseSlug: string;
  phaseName: string;
  moduleNumber: number;
  moduleTitle: string;
}

export function useCurriculumProgress() {
  const [progressMap, setProgressMap] = useState<Record<string, ProgressItem>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to construct map key
  const makeKey = (phaseSlug: string, moduleNumber: number) => `${phaseSlug}:${moduleNumber}`;

  // Read local storage
  const getLocalProgress = (): Record<string, ProgressItem> => {
    if (typeof window === "undefined") return {};
    try {
      const item = localStorage.getItem(LOCAL_STORAGE_KEY);
      return item ? JSON.parse(item) : {};
    } catch (e) {
      console.error("Error reading curriculum progress from localStorage", e);
      return {};
    }
  };

  // Save local storage
  const setLocalProgress = (map: Record<string, ProgressItem>) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(map));
    } catch (e) {
      console.error("Error saving curriculum progress to localStorage", e);
    }
  };

  // Sync state & Supabase
  const loadProgress = useCallback(async () => {
    setIsLoading(true);
    const localData = getLocalProgress();
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user ? user.id : null);

      if (!user) {
        // Guest mode - rely on local data
        setProgressMap(localData);
        setIsLoading(false);
        return;
      }

      // User logged in - fetch from Supabase course_progress table
      const { data: dbRows, error } = await supabase
        .from("course_progress")
        .select("phase, module, completed, quiz_score, quiz_passed, completed_at")
        .eq("user_id", user.id);

      if (error) {
        console.error("Failed to load progress from Supabase", error);
        setProgressMap(localData);
        setIsLoading(false);
        return;
      }

      const mergedMap: Record<string, ProgressItem> = { ...localData };

      // Map phase numbers back to phase slugs
      const phaseNumToSlugMap: Record<number, string> = {};
      phases.forEach(p => {
        const num = parseInt(p.number, 10);
        phaseNumToSlugMap[num] = p.slug;
      });

      if (dbRows) {
        dbRows.forEach(row => {
          const phaseSlug = phaseNumToSlugMap[row.phase];
          if (phaseSlug) {
            const key = makeKey(phaseSlug, row.module);
            mergedMap[key] = {
              phaseSlug,
              moduleNumber: row.module,
              completed: row.completed,
              quizScore: row.quiz_score,
              quizPassed: row.quiz_passed,
              completedAt: row.completed_at
            };
          }
        });
      }

      // If local data had entries not yet in DB, sync them up
      const unSyncedKeys = Object.keys(localData).filter(k => !dbRows?.some(r => {
        const pSlug = phaseNumToSlugMap[r.phase];
        return makeKey(pSlug, r.module) === k;
      }));

      if (unSyncedKeys.length > 0) {
        for (const key of unSyncedKeys) {
          const item = localData[key];
          const phaseObj = phases.find(p => p.slug === item.phaseSlug);
          if (phaseObj && item.quizPassed) {
            await fetch("/api/curriculum/progress", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                phase_slug: item.phaseSlug,
                module_number: item.moduleNumber,
                quiz_score: item.quizScore,
                quiz_passed: item.quizPassed
              })
            }).catch(err => console.error("Error syncing local progress to backend", err));
          }
        }
      }

      setProgressMap(mergedMap);
      setLocalProgress(mergedMap);
    } catch (e) {
      console.error("Error in loadProgress", e);
      setProgressMap(localData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Mark module complete function
  const markModuleCompleted = async (phaseSlug: string, moduleNumber: number, quizScore: number) => {
    const key = makeKey(phaseSlug, moduleNumber);
    const newItem: ProgressItem = {
      phaseSlug,
      moduleNumber,
      completed: true,
      quizScore,
      quizPassed: true,
      completedAt: new Date().toISOString()
    };

    const updatedMap = { ...progressMap, [key]: newItem };
    setProgressMap(updatedMap);
    setLocalProgress(updatedMap);

    // Call backend API if user is authenticated or to ensure cert check
    try {
      const res = await fetch("/api/curriculum/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase_slug: phaseSlug,
          module_number: moduleNumber,
          quiz_score: quizScore,
          quiz_passed: true
        })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Failed to post progress to API", err);
      return { success: false };
    }
  };

  // Get single module progress
  const getModuleProgress = (phaseSlug: string, moduleNumber: number): ProgressItem | null => {
    const key = makeKey(phaseSlug, moduleNumber);
    return progressMap[key] || null;
  };

  // Get phase progress summary
  const getPhaseProgress = (phaseSlug: string): PhaseProgress => {
    const phase = phases.find(p => p.slug === phaseSlug);
    if (!phase) {
      return {
        phaseSlug,
        phaseName: "",
        totalModules: 0,
        completedModules: 0,
        percentage: 0,
        isFullyCompleted: false
      };
    }

    let completedCount = 0;
    for (let i = 1; i <= phase.modules_count; i++) {
      const item = progressMap[makeKey(phaseSlug, i)];
      if (item && item.completed) {
        completedCount++;
      }
    }

    const percentage = phase.modules_count > 0 
      ? Math.round((completedCount / phase.modules_count) * 100) 
      : 0;

    return {
      phaseSlug,
      phaseName: phase.name,
      totalModules: phase.modules_count,
      completedModules: completedCount,
      percentage,
      isFullyCompleted: completedCount >= phase.modules_count && phase.modules_count > 0
    };
  };

  // Get overall platform progress
  const getOverallProgress = () => {
    let totalModules = 0;
    let completedModules = 0;

    phases.forEach(phase => {
      totalModules += phase.modules_count;
      for (let i = 1; i <= phase.modules_count; i++) {
        const item = progressMap[makeKey(phase.slug, i)];
        if (item && item.completed) {
          completedModules++;
        }
      }
    });

    const percentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

    return {
      totalModules,
      completedModules,
      percentage
    };
  };

  // Get next incomplete module for "Resume where you left off" CTA
  const getNextIncompleteModule = (): NextModule | null => {
    for (const phase of phases) {
      for (let i = 1; i <= phase.modules_count; i++) {
        const item = progressMap[makeKey(phase.slug, i)];
        if (!item || !item.completed) {
          const moduleTitle = phase.modules_list[i - 1] || `Module ${i}`;
          return {
            phaseSlug: phase.slug,
            phaseName: phase.name,
            moduleNumber: i,
            moduleTitle
          };
        }
      }
    }
    return null;
  };

  return {
    progressMap,
    isLoading,
    userId,
    markModuleCompleted,
    getModuleProgress,
    getPhaseProgress,
    getOverallProgress,
    getNextIncompleteModule,
    refreshProgress: loadProgress
  };
}
