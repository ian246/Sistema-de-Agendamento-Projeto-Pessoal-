import dotenv from 'dotenv';
dotenv.config();

import { serviceRepository } from './repositories/serviceRepository.js';

async function main() {
    try {
        console.log("Testing serviceRepository.findById...");
        const serviceId = "ca0bd284-ed58-4c98-8d8e-46d3371affc1"; // ID from user report
        const service = await serviceRepository.findById(serviceId);
        console.log("Service found:", service);
    } catch (error) {
        console.error("Error in serviceRepository.findById:", error);
    }
}

main();
