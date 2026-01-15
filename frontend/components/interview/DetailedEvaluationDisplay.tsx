"use client";

import React from 'react';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  BookOpen, 
  GraduationCap, 
  Target,
  Rocket,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface DetailedEvaluationProps {
  evaluation: any;
}

export default function DetailedEvaluationDisplay({ evaluation }: DetailedEvaluationProps) {
  if (!evaluation?.detailedEvaluation) {
    return null;
  }

  const { detailedEvaluation } = evaluation;

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-orange-50 to-white rounded-3xl border border-orange-100">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-orange-200">
        <div className="p-3 bg-orange-500 rounded-xl">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-black">AI Performance Analysis</h2>
          <p className="text-sm text-gray-500 font-medium">Personalized insights and recommendations</p>
        </div>
      </div>

      {/* Overall Assessment */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="text-3xl">📊</div>
          <div>
            <h3 className="text-lg font-black text-black mb-2">Overall Assessment</h3>
            <p className="text-gray-700 leading-relaxed">{detailedEvaluation.overallAssessment}</p>
          </div>
        </div>
      </div>

      {/* Strengths */}
      {detailedEvaluation.strengths?.length > 0 && (
        <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-black text-green-900">Strengths</h3>
          </div>
          <div className="space-y-4">
            {detailedEvaluation.strengths.map((strength: any, idx: number) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-green-100">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-green-900 mb-1">{strength.area}</h4>
                    <p className="text-sm text-gray-700 mb-2">{strength.description}</p>
                    <p className="text-xs text-green-700 italic">Evidence: {strength.evidence}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weaknesses */}
      {detailedEvaluation.weaknesses?.length > 0 && (
        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-black text-orange-900">Areas for Improvement</h3>
          </div>
          <div className="space-y-4">
            {detailedEvaluation.weaknesses.map((weakness: any, idx: number) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-orange-100">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-orange-900 mb-1">{weakness.area}</h4>
                    <p className="text-sm text-gray-700 mb-2">{weakness.description}</p>
                    <p className="text-xs text-orange-700 italic">Impact: {weakness.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topics to Learn */}
      {detailedEvaluation.topicsToLearn?.length > 0 && (
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-black text-blue-900">Learning Roadmap</h3>
          </div>
          <div className="space-y-4">
            {detailedEvaluation.topicsToLearn.map((topic: any, idx: number) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-blue-100">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-blue-900">{topic.topic}</h4>
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                    topic.priority === 'High' ? 'bg-red-100 text-red-700' :
                    topic.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {topic.priority} Priority
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3">{topic.reason}</p>
                {topic.estimatedTime && (
                  <p className="text-xs text-blue-600 font-medium mb-2">⏱️ Estimated Time: {topic.estimatedTime}</p>
                )}
                {topic.resources && (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-blue-800">Recommended Resources:</p>
                    {topic.resources.map((resource: string, ridx: number) => (
                      <p key={ridx} className="text-xs text-gray-600 pl-4">• {resource}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Courses */}
      {detailedEvaluation.recommendedCourses?.length > 0 && (
        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-black text-purple-900">Recommended Courses</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {detailedEvaluation.recommendedCourses.map((course: any, idx: number) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-purple-100">
                <h4 className="font-bold text-purple-900 mb-1">{course.title}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-xs text-purple-600 font-medium">{course.platform}</p>
                  {course.difficulty && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                      {course.difficulty}
                    </span>
                  )}
                </div>
                {course.instructor && (
                  <p className="text-xs text-gray-500 mb-2">👨‍🏫 {course.instructor}</p>
                )}
                <p className="text-sm text-gray-700 mb-2">{course.focus}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">⏱️ {course.estimatedTime}</p>
                  {course.link && course.link !== 'Search on ' + course.platform && (
                    <a 
                      href={course.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-purple-600 hover:text-purple-800 font-bold"
                    >
                      View Course →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Practice Recommendations */}
      {detailedEvaluation.practiceRecommendations?.length > 0 && (
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-200">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-black text-indigo-900">Practice Plan</h3>
          </div>
          <div className="space-y-3">
            {detailedEvaluation.practiceRecommendations.map((rec: any, idx: number) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-indigo-100 flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-indigo-900">{rec.category}</h4>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md font-bold">
                      {rec.frequency}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{rec.action}</p>
                  {rec.duration && (
                    <p className="text-xs text-indigo-600 mb-2">⏱️ {rec.duration} per session</p>
                  )}
                  {rec.examples && rec.examples.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs font-bold text-indigo-800">Examples:</p>
                      {rec.examples.map((example: string, eidx: number) => (
                        <p key={eidx} className="text-xs text-gray-600 pl-4">• {example}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {detailedEvaluation.nextSteps?.length > 0 && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-2xl text-white">
          <div className="flex items-center gap-2 mb-4">
            <Rocket className="w-5 h-5" />
            <h3 className="text-lg font-black">Next Steps</h3>
          </div>
          <ul className="space-y-2">
            {detailedEvaluation.nextSteps.map((step: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-black">{idx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Interview Readiness */}
      {detailedEvaluation.interviewReadiness && (
        <div className="bg-gray-900 p-6 rounded-2xl text-white">
          <h3 className="text-lg font-black mb-4">Interview Readiness Assessment</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Level</p>
              <p className="text-lg font-bold">{detailedEvaluation.interviewReadiness.level}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Confidence</p>
              <p className="text-lg font-bold text-orange-400">{detailedEvaluation.interviewReadiness.confidence}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Time to Ready</p>
              <p className="text-lg font-bold">{detailedEvaluation.interviewReadiness.timeToReady}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Focus Areas</p>
              <p className="text-sm font-bold">{detailedEvaluation.interviewReadiness.focusAreas?.length || 0} areas</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
