import {
  asksForMoreTechnologies,
  asksForMoreComplexity,
  asksForMoreRecent,
  asksForRecruiterRecommendation,
  asksForGeneralRecommendation
} from "./comparisonDetector.js";

import {
  getContextualComparisonProjects
} from "./comparisonProjects.js";

import {
  detectComparedTechnology
} from "./comparisonMetrics.js";

import {
  buildTechnologyCountResponse,
  buildComplexityResponse,
  buildRecentResponse,
  buildTechnologyUsageResponse,
  buildGeneralRecommendation,
  buildRecruiterRecommendation
} from "./comparisonResponses.js";

export function getComparisonFollowUpResponse(message) {
  const projects =
    getContextualComparisonProjects();

  if (projects.length < 2) {
    return null;
  }

  const [
    firstProject,
    secondProject
  ] = projects;

  if (
    asksForMoreTechnologies(message)
  ) {
    return buildTechnologyCountResponse(
      firstProject,
      secondProject
    );
  }

  if (
    asksForMoreComplexity(message)
  ) {
    return buildComplexityResponse(
      firstProject,
      secondProject
    );
  }

  if (
    asksForMoreRecent(message)
  ) {
    return buildRecentResponse(
      firstProject,
      secondProject
    );
  }

  const detectedTechnology =
    detectComparedTechnology(
      message,
      firstProject,
      secondProject
    );

  if (detectedTechnology) {
    return buildTechnologyUsageResponse(
      firstProject,
      secondProject,
      detectedTechnology
    );
  }

  if (
    asksForRecruiterRecommendation(
      message
    )
  ) {
    return buildRecruiterRecommendation(
      firstProject,
      secondProject
    );
  }

  if (
    asksForGeneralRecommendation(
      message
    )
  ) {
    return buildGeneralRecommendation(
      firstProject,
      secondProject
    );
  }

  return null;
}