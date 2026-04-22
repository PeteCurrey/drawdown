import { Region } from "@/lib/seo/hreflang";
import { HOW_TO_PAGES_US, BEST_OF_PAGES_US, COMPARE_PAGES_US } from "@/data/seo/us-data";
import { HOW_TO_PAGES_AU } from "@/data/seo/how-to-au";
import { BEST_OF_PAGES_AU } from "@/data/seo/best-au";
import { COMPARE_PAGES_AU } from "@/data/seo/compare-au";
import { HOW_TO_PAGES_CA, BEST_OF_PAGES_CA, COMPARE_PAGES_CA } from "@/data/seo/ca-data";
import { HOW_TO_PAGES_DE, BEST_OF_PAGES_DE, COMPARE_PAGES_DE } from "@/data/seo/de-data";

export function getRegionalHowToData(region: Region) {
  switch (region) {
    case "us": return HOW_TO_PAGES_US;
    case "au": return HOW_TO_PAGES_AU;
    case "ca": return HOW_TO_PAGES_CA;
    case "de": return HOW_TO_PAGES_DE;
    default: return HOW_TO_PAGES_US;
  }
}

export function getRegionalBestOfData(region: Region) {
  switch (region) {
    case "us": return BEST_OF_PAGES_US;
    case "au": return BEST_OF_PAGES_AU;
    case "ca": return BEST_OF_PAGES_CA;
    case "de": return BEST_OF_PAGES_DE;
    default: return BEST_OF_PAGES_US;
  }
}

export function getRegionalCompareData(region: Region) {
  switch (region) {
    case "us": return COMPARE_PAGES_US;
    case "au": return COMPARE_PAGES_AU;
    case "ca": return COMPARE_PAGES_CA;
    case "de": return COMPARE_PAGES_DE;
    default: return COMPARE_PAGES_US;
  }
}
