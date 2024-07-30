# Real-Time Flight Status and Notifications System

## Overview

This system provides real-time flight status updates and notifications to passengers. It handles flight status changes, sends notifications via email, and integrates with airport systems using mock data. The architecture includes multiple services to manage notifications, user data, bookings, and flight data.

## Architecture

### Components

1. **Notification Services**

   - **Emergency Notification Service**: Handles notifications for flights with delays ≤ 20 minutes. Uses RabbitMQ for queuing.
   - **Non-Emergency Notification Service**: Handles notifications for other flight status changes. Uses RabbitMQ for queuing.
   - **Notification Sending Service**: Consumes messages from RabbitMQ queues and sends notifications via email using NodeMailer. Prioritizes emergency notifications.

2. **Data Fetching Service**

   - Fetches data from `flightData.json` every 5 minutes.
   - Processes 10 records at a time and queues messages based on specific conditions:
     - Emergency Queue: Flight canceled or significant departure delay.
     - Non-Emergency Queue: Tentative terminal changes or minor delays.

3. **User Flight Data Service**

   - Provides endpoints to fetch flight data.
   - Sends the next 10 flight records on each request.

4. **User Management and Booking Service**
   - **User Registration API**: Registers users with their details (name, email, phoneNumber).
   - **Booking API**: Books flights for users and manages notification preferences.
   - **Cancel Booking API**: Cancels bookings based on booking ID.
   - **Email Notification Opt-In/Out API**: Toggles email notifications for bookings.

## Directory Structure

```plaintext
.
├── services/
│   ├── emergency-notification-service/
│   ├── non-emergency-notification-service/
│   ├── notification-sending-service/
│   ├── flight-data-service/
│   └── user-booking-service/
├── .gitignore
├── docker-compose.yml
├── Dockerfile
└── README.md
```
