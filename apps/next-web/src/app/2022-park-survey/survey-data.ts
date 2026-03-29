export interface SurveyOption {
  label: string
  percent: number
  count: number
}

export interface SurveyQuestion {
  id: string
  question: string
  respondents: number
  skipped: number
  type: "single" | "multi" | "ranked" | "binary" | "open"
  options: SurveyOption[]
}

export const SURVEY_META = {
  title: "Friends of Chimborazo Park - Survey of Park Users and Interested Public",
  source: "SurveyMonkey",
  totalRespondents: 303,
  questionCount: 10,
}

// Q1: How often do you use the park?
export const Q1_FREQUENCY: SurveyQuestion = {
  id: "q1",
  question: "How often do you use the park?",
  respondents: 299,
  skipped: 4,
  type: "single",
  options: [
    { label: "Daily", percent: 52.84, count: 158 },
    { label: "Weekly", percent: 36.79, count: 110 },
    { label: "Monthly", percent: 8.03, count: 24 },
    { label: "Every 3 months", percent: 1.0, count: 3 },
    { label: "Once a year", percent: 0.67, count: 2 },
    { label: "Occasionally", percent: 0.67, count: 2 },
    { label: "Never", percent: 0, count: 0 },
  ],
}

// Q2: How do you use the park?
export const Q2_USAGE: SurveyQuestion = {
  id: "q2",
  question: "How do you use the park?",
  respondents: 301,
  skipped: 2,
  type: "multi",
  options: [
    { label: "Walking/Running", percent: 90.03, count: 271 },
    { label: "Sunset/Birdwatching", percent: 53.16, count: 160 },
    { label: "Dog Park/Dog Walks", percent: 52.82, count: 159 },
    { label: "Picnics and gatherings", percent: 43.85, count: 132 },
    { label: "Personal biking/Mountain biking", percent: 17.28, count: 52 },
    { label: "Other exercise", percent: 12.62, count: 38 },
    { label: "Organizational events", percent: 11.63, count: 35 },
    { label: "Other", percent: 11.3, count: 34 },
    { label: "Yoga/Wellness", percent: 9.3, count: 28 },
  ],
}

// Q3: What existing features would you like the City to invest in?
export const Q3_INVEST: SurveyQuestion = {
  id: "q3",
  question:
    "What existing features would you like the City of Richmond to invest in, repair, or replace?",
  respondents: 298,
  skipped: 5,
  type: "ranked",
  options: [
    { label: "Quality of Hillside/Trails and Slopes to Lower Park", percent: 65.1, count: 194 },
    { label: "Sidewalks", percent: 53.36, count: 159 },
    { label: "Gardens/Flower Beds", percent: 38.26, count: 114 },
    { label: "Lampposts/Lighting", percent: 36.91, count: 110 },
    { label: "Existing Staircases", percent: 36.24, count: 108 },
    {
      label: "Natural Spring and Fountain (behind roundhouse)",
      percent: 34.56,
      count: 103,
    },
    { label: "Cobblestone Paths", percent: 26.51, count: 79 },
    { label: "Roundhouse", percent: 19.8, count: 59 },
    { label: "Gazebo", percent: 17.79, count: 53 },
    { label: "Access Roads and Parking", percent: 8.72, count: 26 },
  ],
}

// Q4: Choose your preference for level of public events
export const Q4_EVENT_LEVEL: SurveyQuestion = {
  id: "q4",
  question: "Choose your preference for the level of public events at the park.",
  respondents: 301,
  skipped: 2,
  type: "single",
  options: [
    { label: "Moderate - Neighborhood and group events", percent: 59.13, count: 178 },
    { label: "High - City-wide events", percent: 32.23, count: 97 },
    { label: "Low - Small gatherings", percent: 7.64, count: 23 },
    { label: "Unplanned gatherings", percent: 1.0, count: 3 },
  ],
}

// Q5: What types of events would you like?
export const Q5_EVENT_TYPES: SurveyQuestion = {
  id: "q5",
  question: "What types of events would you like Friends of Chimborazo to advocate for, if any?",
  respondents: 301,
  skipped: 2,
  type: "multi",
  options: [
    { label: "Farmer's Market", percent: 84.72, count: 255 },
    { label: "Movies in the park, public theater, poetry, dance", percent: 71.43, count: 215 },
    { label: "Music Festivals", percent: 63.79, count: 192 },
    { label: "Arts/Crafts Exhibitions", percent: 60.13, count: 181 },
    { label: "Community Exercise or Yoga", percent: 53.16, count: 160 },
    {
      label: "Youth-led events (games, festivals, school-support activities)",
      percent: 36.54,
      count: 110,
    },
    {
      label: "Community Celebrations/Social Events/Picnics/Worship",
      percent: 34.88,
      count: 105,
    },
    { label: "Dog Festivals", percent: 33.89, count: 102 },
    { label: "Mountain/Trail bike competitions", percent: 16.61, count: 50 },
    { label: "Vintage Car and Motorcycle Shows", percent: 11.63, count: 35 },
    { label: "Other", percent: 6.31, count: 19 },
  ],
}

// Q6: What safety features would you like?
export const Q6_SAFETY: SurveyQuestion = {
  id: "q6",
  question:
    "What safety features would you like Friends of Chimborazo to petition the City of Richmond to provide?",
  respondents: 296,
  skipped: 7,
  type: "multi",
  options: [
    { label: "Maintenance of sidewalks and paved surfaces", percent: 68.58, count: 203 },
    {
      label: "Additional stop signs and crosswalks on East Broad Street",
      percent: 65.88,
      count: 195,
    },
    {
      label: "Ramps for ADA access for those with walkers, use of a cane, strollers, etc.",
      percent: 48.31,
      count: 143,
    },
    {
      label: "Lighting of specific unlit or dimly-lit areas",
      percent: 27.7,
      count: 82,
    },
  ],
}

// Q7: What other amenities and features would you like to see?
export const Q7_AMENITIES: SurveyQuestion = {
  id: "q7",
  question: "What other amenities and features would you like to see in the park?",
  respondents: 298,
  skipped: 5,
  type: "multi",
  options: [
    {
      label: "Trail markers and trail improvements towards Gillies Creek and Lower Chimborazo",
      percent: 58.72,
      count: 175,
    },
    { label: "Public restrooms", percent: 50.0, count: 149 },
    {
      label: "More tree-shaded walkways and groves",
      percent: 49.66,
      count: 148,
    },
    { label: "Murals / artwork / installation art or sculpture", percent: 45.64, count: 136 },
    { label: "More formal gardens with native plantings", percent: 45.64, count: 136 },
    { label: "Picnic benches in selected locations", percent: 44.63, count: 133 },
    {
      label: "Public information about events, trails, reservations",
      percent: 42.28,
      count: 126,
    },
    { label: "Scenic overlook behind roundhouse", percent: 39.93, count: 119 },
    { label: "Community garden expansion", percent: 34.9, count: 104 },
    { label: "Historical information about Chimborazo", percent: 32.21, count: 96 },
    {
      label: "Electrical power (e.g. for Christmas lights, Gazebo, potentially solar)",
      percent: 28.19,
      count: 84,
    },
    {
      label: "More recreational use sites (volleyball, horseshoe pits, Petanque/Bocce)",
      percent: 23.15,
      count: 69,
    },
    { label: "Covered recreational shelters available by reservation", percent: 20.13, count: 60 },
  ],
}

// Q8: What historic features would you suggest be restored?
export const Q8_HISTORIC: SurveyQuestion = {
  id: "q8",
  question: "What historic features would you suggest be restored in the longer-term?",
  respondents: 294,
  skipped: 9,
  type: "multi",
  options: [
    { label: "Washed out cobblestone roads / trails", percent: 65.65, count: 193 },
    {
      label: "Fountain in the center of the large, paved circle surrounded by crepe myrtle trees",
      percent: 65.65,
      count: 193,
    },
    { label: "Spring-fed stair area and trough (near Dog Park)", percent: 46.94, count: 138 },
    { label: "East End stairway", percent: 41.16, count: 121 },
    { label: "Retaining walls in upper and lower park areas", percent: 38.1, count: 112 },
    { label: "Beer caves", percent: 31.29, count: 92 },
    { label: "Other", percent: 5.1, count: 15 },
  ],
}

// Q9: Scenic Overlook walkway replacement
export const Q9_WALKWAY: SurveyQuestion = {
  id: "q9",
  question:
    "There is a City Parks proposal to replace the current Scenic Overlook walkway (now concrete, which rings the hillside) with grass. Grass is not an ADA compliant option. Community input is needed.",
  respondents: 287,
  skipped: 16,
  type: "binary",
  options: [
    {
      label: "Replace entire walkway with ADA compliant material of ANY type",
      percent: 75.26,
      count: 216,
    },
    {
      label: "Replace/repair existing sidewalk with CONCRETE ONLY",
      percent: 24.74,
      count: 71,
    },
  ],
}

// Q10: Open-ended suggestions (151 responded, 152 skipped — no quantitative data to display)
