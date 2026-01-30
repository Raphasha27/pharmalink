/**
 * Simulated OCR Service for PharmaLink
 * In production, this would integrate with AWS Textract, Google Cloud Vision, or a custom model.
 */

exports.extractMedicationData = async (imageUrl) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock extraction result based on the image URL or random data
    // Usually, image analysis would happen here.
    return {
        patientName: "David Nkosi",
        idNumber: "9001015000081",
        medications: [
            { name: "Metformin", dosage: "500mg", schedule: 3, quantity: 60 },
            { name: "Amlodipine", dosage: "5mg", schedule: 3, quantity: 30 }
        ],
        doctorName: "Dr. S. Molefe",
        doctorPracticeNumber: "012345678/10",
        isControlledSubstance: false,
        isRefrigerated: false,
        confidenceScore: 0.94
    };
};
