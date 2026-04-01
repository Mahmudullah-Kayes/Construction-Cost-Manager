# Construction Cost Manager

A dynamic web application for tracking construction costs, including materials, labor, and miscellaneous expenses. Built with React and Laravel, it can be deployed locally or on a server for simple, centralized cost management.

---
## Run Locally

### Backend
1. Go to `backend` folder.  
2. Create a database (e.g., with XAMPP).  
3. Run migrations: `php artisan migrate`  
4. Start Laravel server: `php artisan serve`  

### Frontend
1. Go to `frontend` folder.  
2. Install dependencies: `npm install`  
3. Start React server: `npm start`  

### Access
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Hosting Online
- Deploy backend and frontend like normal websites.  
- Configure the database.  
- All users share the same project data.

# Features
## 1. Materials Section

- Each material has its own page/tab  
- Add entries with:
  - Date  
  - Material name *(optional if fixed per tab)*  
  - Amount (quantity)  
  - Price  
  - Note *(optional)*  

**Table Features:**
- Edit entries  
- Delete entries  
- Total cost per material (sum of prices)  
- Filter entries (e.g., by material or specific criteria)  

---

## 2. Labor Cost Section

- Single page to track labor expenses  
- Fields:
  - Date  
  - Paid amount  
  - Note *(optional)*  

**Includes:**
- Table view  
- Running total  

---

## 3. Miscellaneous Cost Section

- Track additional/random expenses  
- Fields:
  - Date  
  - Cost name  
  - Price  
  - Note *(optional)*  

**Includes:**
- Table view  
- Total cost  

---

## 4. Summary Page

- Total materials cost  
- Total labor cost  
- Total miscellaneous cost  
- **Grand total**

> No charts or advanced analytics included

---
