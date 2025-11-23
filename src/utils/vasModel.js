/**
 * VAS Recovery Model
 * Ported from Python implementation
 */

// Constants
const ALPHA = 4.79;
const BETA = 0.56;
const LAMBDA = 0.296; // decay rate

// SD Interpolation Points
const SD_POINTS = [
    { t: 1.5, sd: 1.78 },
    { t: 3.0, sd: 1.79 },
    { t: 6.0, sd: 1.18 },
    { t: 12.0, sd: 0.84 },
];

/**
 * Approximation of the error function erf(x)
 * Using Abramowitz and Stegun approximation (maximum error: 1.5e-7)
 */
function erf(x) {
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
}

/**
 * Standard Normal CDF Φ(z)
 */
function normalCDF(z) {
    return 0.5 * (1.0 + erf(z / Math.sqrt(2.0)));
}

/**
 * Calculate Mean VAS at time t (months)
 * VAS_mean(t) = beta + alpha * exp(-lambda * t)
 */
export function getMeanVAS(t_months) {
    return BETA + ALPHA * Math.exp(-LAMBDA * t_months);
}

/**
 * Calculate SD at time t (months) using linear interpolation
 */
export function getSDVAS(t_months) {
    // Out of bounds checks
    if (t_months <= SD_POINTS[0].t) return SD_POINTS[0].sd;
    if (t_months >= SD_POINTS[SD_POINTS.length - 1].t) return SD_POINTS[SD_POINTS.length - 1].sd;

    // Find interval
    for (let i = 0; i < SD_POINTS.length - 1; i++) {
        const p1 = SD_POINTS[i];
        const p2 = SD_POINTS[i + 1];

        if (t_months >= p1.t && t_months <= p2.t) {
            const ratio = (t_months - p1.t) / (p2.t - p1.t);
            return p1.sd + ratio * (p2.sd - p1.sd);
        }
    }

    return SD_POINTS[SD_POINTS.length - 1].sd;
}

/**
 * Calculate Z-score and Percentile
 */
export function calculateVasStats(t_months, vas_value) {
    const mu = getMeanVAS(t_months);
    const sigma = getSDVAS(t_months);

    const z = (vas_value - mu) / sigma;
    const percentile = normalCDF(z) * 100.0;

    return {
        t_months,
        vas: vas_value,
        mean: mu,
        sd: sigma,
        z_score: z,
        percentile
    };
}

/**
 * Calculate months difference between two dates
 */
export function getMonthsSinceSurgery(surgeryDateStr) {
    const surgeryDate = new Date(surgeryDateStr);
    const today = new Date();

    // Calculate difference in milliseconds
    const diffTime = Math.abs(today - surgeryDate);
    // Convert to months (approximate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays / 30.44; // Average days in a month
}

/**
 * Predict future VAS score 3 months from now
 * Based on current trajectory and expected recovery curve
 */
export function predictFutureVAS(currentMonths, currentVAS) {
    const futureMonths = currentMonths + 3;

    // Get current and future expected means
    const currentMean = getMeanVAS(currentMonths);
    const futureMean = getMeanVAS(futureMonths);

    // Calculate current deviation from mean
    const currentDeviation = currentVAS - currentMean;

    // Get current and future SDs
    const currentSD = getSDVAS(currentMonths);
    const futureSD = getSDVAS(futureMonths);

    // Assume the patient maintains their relative position (z-score)
    // but with some regression to the mean (0.7 factor)
    const zScore = currentDeviation / currentSD;
    const adjustedZScore = zScore * 0.7; // Regression to mean

    // Predict future VAS
    const predictedVAS = futureMean + (adjustedZScore * futureSD);

    // Ensure VAS is within valid range [0, 10]
    return Math.max(0, Math.min(10, predictedVAS));
}

