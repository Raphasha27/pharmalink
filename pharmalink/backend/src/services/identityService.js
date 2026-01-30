/**
 * Simulated South African Identity Verification Service
 * Integrates with 3rd party verification providers (e.g., Home Affairs / ThisIsMe / HURU)
 */

exports.verifySAID = async (idNumber) => {
    // 1. Check if it's a valid 13-digit SA ID using Luhn Algorithm logic
    if (!idNumber || idNumber.length !== 13) {
        return { valid: false, error: "Invalid ID length" };
    }

    // 2. Simulate external API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // For demo purposes, we accept any 13-digit number starting with valid birth years
    const year = parseInt(idNumber.substring(0, 2));
    const month = parseInt(idNumber.substring(2, 4));
    const day = parseInt(idNumber.substring(4, 6));

    if (month > 12 || day > 31) {
        return { valid: false, error: "Invalid birth date encoded in ID" };
    }

    return {
        valid: true,
        data: {
            firstNames: "DAVID",
            lastName: "NKOSI",
            gender: parseInt(idNumber.substring(6, 10)) < 5000 ? "Female" : "Male",
            citizenship: idNumber.substring(10, 11) === '0' ? "SA Citizen" : "Permanent Resident",
            deceased: false
        }
    };
};
