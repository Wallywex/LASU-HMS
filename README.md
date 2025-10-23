# LASU Hall Management System (LASU-HMS)

### Backend Repository
The C++ backend for this project is located in a separate repository.
**[Click here to view the Backend Code](https://github.com/Wallywex/cppAssignment-Group4.git)**

---

## 1. The Problem

Students at our university often face significant challenges with class scheduling. A class could be cancelled upon arrival simply because a lecture hall was unavailable, wasting students' time and transportation costs. This was caused by a lack of a centralized, real-time system for viewing and booking hall availability.

## 2. The Solution

LASU-HMS is a full-stack web application that solves this problem. It provides a live dashboard of all lecture halls, allowing course representatives to see which halls are free and book them in advance. This ensures that a hall is secured *before* a class is scheduled, preventing last-minute cancellations.

## 3. Tech Stack

* **Frontend:** ReactJS, TypeScript, Vite
* **Backend:** C++, Crow (C++ Micro-framework)
* **Database:** SQLite
* **Version Control:** Git & GitHub

## 4. Key Features

* **Secure Authentication:** Secure user login and registration for course reps and administrators.
* **Real-time Dashboard:** A live calendar dashboard showing all hall bookings and current availability.
* **Conflict-Free Booking:** A smart booking form with built-in conflict prevention logic that stops a hall from being double-booked.
* **Admin Panel:** A dedicated interface for university staff to add, remove, or manage hall listings and user permissions.
