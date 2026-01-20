# Database Scripts

This directory contains utility scripts for managing the INKCAL database.

## Available Scripts

### List Users

Lists all users in the database with their email addresses and creation dates.

```bash
npm run list-users
```

### Seed Example Data

Seeds example appointments and work schedule for a specific user. This will:
- Delete existing appointments and workdays for the user
- Create a work schedule (Mon-Fri 9 AM - 6 PM, Sat 10 AM - 2 PM, Sun off)
- Create 12 example appointments for the current week

```bash
npm run seed-example -- <user-email>
```

**Example:**
```bash
npm run seed-example -- steffen@test.com
```

## Example Data Created

The seed script creates:

### Workdays Configuration
- **Monday-Friday**: 9:00 AM - 6:00 PM
- **Saturday**: 10:00 AM - 2:00 PM
- **Sunday**: Off

### Appointments (12 total for current week)

**Monday**
- 10:00-16:00: Full Sleeve Session (John Smith) - New Tattoo

**Tuesday**
- 09:30-10:30: Consultation: Back Piece (Sarah Johnson) - Consultation
- 14:00-15:30: Touch-up Session (Mike Davis) - Touch Up

**Wednesday**
- 11:00-12:30: Minimalist Tattoo (Emma Wilson) - New Tattoo
- 13:00-14:00: Lunch Break - Blocker
- 15:00-17:00: Flower Tattoo (Lisa Brown) - New Tattoo

**Thursday**
- 09:00-10:00: New Client Consultation (Alex Turner) - Consultation
- 11:00-14:00: Cover-up Tattoo (Tom Anderson) - New Tattoo
- 15:00-16:00: Script Tattoo (Rachel Green) - New Tattoo

**Friday**
- 10:00-11:00: Free Touch-up (Chris Martin) - Touch Up
- 14:00-15:30: Sleeve Planning (David Lee) - Consultation

**Saturday**
- 10:30-12:00: Small Design (Sophie Miller) - New Tattoo

## Notes

- These scripts connect directly to the MongoDB database using the connection string from `.env.development.local`
- The seed script will **delete** existing appointments and workdays for the specified user
- Appointments are created for the current week (Monday of this week)
