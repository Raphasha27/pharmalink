/**
 * Simulated South African Medical Aid Adjudication Engine
 * Handles real-time benefit checks for major schemes (Discovery, GEMS, etc.)
 */

const SCHEME_CONFIGS = {
    'Discovery Health': { coverageRate: 0.92, limitPerOrder: 5000, requiresPreAuth: ['opioids', 'oncology'] },
    'GEMS': { coverageRate: 1.0, limitPerOrder: 3000, requiresPreAuth: ['specialized'] },
    'Bonitas': { coverageRate: 0.85, limitPerOrder: 4000, requiresPreAuth: [] },
    'Momentum': { coverageRate: 0.90, limitPerOrder: 4500, requiresPreAuth: ['chronic'] },
    'DHMS': { coverageRate: 0.95, limitPerOrder: 10000, requiresPreAuth: [] }
};

exports.adjudicateClaim = async (schemeName, medications) => {
    // Simulate EDI Switching delay (e.g., MediSwitch)
    await new Promise(resolve => setTimeout(resolve, 1200));

    const config = SCHEME_CONFIGS[schemeName] || { coverageRate: 0.0, limitPerOrder: 0, requiresPreAuth: [] };
    
    let totalValue = 0;
    const items = medications.map(med => {
        const cost = med.price || (Math.random() * 500 + 100);
        totalValue += cost;
        
        const coveredAmount = cost * config.coverageRate;
        const patientCoPayment = cost - coveredAmount;

        return {
            name: med.name,
            cost: cost.toFixed(2),
            benefitCover: coveredAmount.toFixed(2),
            patientPortion: patientCoPayment.toFixed(2),
            status: 'Approved'
        };
    });

    const totalCovered = totalValue * config.coverageRate;
    const totalCoPay = totalValue - totalCovered;

    return {
        transactionId: `EDI-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        scheme: schemeName,
        status: totalValue > config.limitPerOrder ? 'Pended (Exceeds Limit)' : 'Success',
        summary: {
            totalValue: totalValue.toFixed(2),
            benefitPaid: totalCovered.toFixed(2),
            patientCoPayment: totalCoPay.toFixed(2)
        },
        items,
        timestamp: new Date()
    };
};
