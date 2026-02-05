# **🚀 Full-Stack Engineering Challenge: Bulltrack Pro**

**Position:** Semi-Senior Full Stack Developer

**Company:** Seed28

**Level:** Level 2 (Robustness & Persistence)

---

## **1\. Project Context**

**Bulltrack** is an advanced bovine genetic ranking platform. Cattle producers use this tool to make high-stakes purchasing decisions. While the UI must be "Pixel-Perfect," the real value lies in the **integrity and performance of the data layer.**

We are looking for your ability to bridge the gap between a polished frontend and a secure, scalable backend. You are expected to move beyond static JSON and build a dynamic system where user data persists.

## **2\. The Mission**

Your goal is to build the "Classification Results" dashboard. This involves:

1. **Frontend:** Replicating the [provided Figma design](https://www.figma.com/design/aXlJ1bAISzgnoQFwKQfvZ3/Full-Stack-Technical-Challenge---Semi-Senior?node-id=0-1&t=WazXILUDfLFkV66c-1) with Next.js and Tailwind.  
2. **Backend:** Building an API to manage bull data and user-specific favorites.  
3. **Database:** Persisting information in a real database (PostgreSQL).

---

## **3\. Technical Stack Requirements**

* **Frontend:** Next.js 14+ (App Router).  
* **Styling:** Tailwind CSS.  
* **Backend:** A separate Node.js (NestJS) server.  
* **Database:** PostgreSQL.  
* **Auth:** JWT-based implementation.

---

## **4\. Functional Requirements (User Stories)**

### **A. Authentication & User Scope**

* The system must support a "Login." For this challenge, you may provide a default user (e.g., admin@seed28.com / seed28).  
* **Favorites must be user-specific.** If User A marks a bull as a favorite, it should not appear as a favorite for User B.

### **B. Dynamic Listing & Pagination**

* Bulls must be fetched from the database.  
* **Server-side Pagination:** Implement pagination. Do not load all bulls into the frontend memory at once.

### **C. Advanced Server-side Filtering**

All filtering logic must occur at the **Database/API level**, not in the frontend state.

* **Search:** Real-time search by ear tag (caravana) or name.  
* **Sidebar Filters:** “Origen” (toros propios, catálogo, favoritos), “Para vaquillona” (toggle), and “Pelaje” (negro, colorado).  
* **Sorting:** Sort by bull\_score (High/Low).

### **D. The Bull Score Calculation**

The Bull Score is currently a static number in the JSON. For this level, the backend should calculate it dynamically using the following weighted formula:

bullScore \= (C \* 0.30) \+ (F \* 0.25) \+ (R \* 0.20) \+ (M \* 0.15) \+ (Ca \* 0.10)  
*Where:* C: Crecimiento, F: Facilidad de Parto, R: Reproducción, M: Moderación, Ca: Carcasa.  
---

## **5\. Technical Expectations**

### **Backend & Architecture**

* **Database Schema:** You must design a schema that handles Bulls, Users, and the "Favorite" relationship.  
* **API Design:** Clean, RESTful endpoints or well-structured Server Actions.  
* **Error Handling:** Implement loading states (Skeletons) and error boundaries for failed API requests.

### **Frontend Quality**

* **Component Modularity:** We expect to see a clear separation between UI components (Atomic Design preferred), Logic (Hooks), and Data Fetching.  
* **Responsiveness:** The dashboard must be fully functional on Desktop and Tablet.

---

## **6\. Seed Data (Initial Load)**

You may use this initial data to seed your database.

JSON  
{  
  "bulls": \[  
    {  
      "id": 1,  
      "caravana": "992",  
      "nombre": "Toro Black Emerald",  
      "uso": "vaquillona",  
      "origen": "propio",  
      "pelaje": "negro",  
      "raza": "Angus",  
      "edad\_meses": 36,  
      "caracteristica\_destacada": "Top 1% calving ease",  
      "stats": {  
        "crecimiento": 85,  
        "facilidad\_parto": 98,  
        "reproduccion": 75,  
        "moderacion": 60,  
        "carcasa": 82  
      }  
    },  
    {  
      "id": 2,  
      "caravana": "845",  
      "nombre": "Red Diamond",  
      "uso": "vaca",  
      "origen": "catalogo",  
      "pelaje": "colorado",  
      "raza": "Angus",  
      "edad\_meses": 42,  
      "caracteristica\_destacada": "Top 5% carcass",  
      "stats": {  
        "crecimiento": 90,  
        "facilidad\_parto": 40,  
        "reproduccion": 88,  
        "moderacion": 70,  
        "carcasa": 95  
      }  
    },  
    {  
      "id": 3,  
      "caravana": "102",  
      "nombre": "General 102",  
      "uso": "vaquillona",  
      "origen": "catalogo",  
      "pelaje": "negro",  
      "raza": "Brangus",  
      "edad\_meses": 30,  
      "caracteristica\_destacada": null,  
      "stats": {  
        "crecimiento": 70,  
        "facilidad\_parto": 92,  
        "reproduccion": 65,  
        "moderacion": 80,  
        "carcasa": 60  
      }  
    },  
    {  
      "id": 4,  
      "caravana": "554",  
      "nombre": "Indomable",  
      "uso": "vaca",  
      "origen": "propio",  
      "pelaje": "colorado",  
      "raza": "Hereford",  
      "edad\_meses": 48,  
      "caracteristica\_destacada": null,  
      "stats": {  
        "crecimiento": 60,  
        "facilidad\_parto": 30,  
        "reproduccion": 95,  
        "moderacion": 50,  
        "carcasa": 75  
      }  
    },  
    {  
      "id": 5,  
      "caravana": "210",  
      "nombre": "Midnight Express",  
      "uso": "vaquillona",  
      "origen": "propio",  
      "pelaje": "negro",  
      "raza": "Angus",  
      "edad\_meses": 28,  
      "caracteristica\_destacada": "Efficiency Leader",  
      "stats": {  
        "crecimiento": 78,  
        "facilidad\_parto": 95,  
        "reproduccion": 82,  
        "moderacion": 85,  
        "carcasa": 68  
      }  
    },  
    {  
      "id": 6,  
      "caravana": "773",  
      "nombre": "Rustic King",  
      "uso": "vaca",  
      "origen": "catalogo",  
      "pelaje": "colorado",  
      "raza": "Braford",  
      "edad\_meses": 54,  
      "caracteristica\_destacada": "Heat Tolerant",  
      "stats": {  
        "crecimiento": 92,  
        "facilidad\_parto": 35,  
        "reproduccion": 90,  
        "moderacion": 45,  
        "carcasa": 88  
      }  
    },  
    {  
      "id": 7,  
      "caravana": "304",  
      "nombre": "Shadow Warrior",  
      "uso": "vaquillona",  
      "origen": "propio",  
      "pelaje": "negro",  
      "raza": "Brangus",  
      "edad\_meses": 32,  
      "caracteristica\_destacada": "Performance Pro",  
      "stats": {  
        "crecimiento": 88,  
        "facilidad\_parto": 85,  
        "reproduccion": 70,  
        "moderacion": 65,  
        "carcasa": 91  
      }  
    }  
  \]  
}

---

## **7\. Submission Guidelines**

1. **Repository:** A public GitHub repository.  
2. **README:** Must include:  
   * Instructions on how to run the project locally (including DB setup).  
   * A brief explanation of your architectural choices (State management, DB choice).  
   * A "Future Improvements" section: What would you do if you had 2 more weeks?  
3. **Deployment:** (Optional but highly valued) A link to a Vercel/Railway/Render deployment.

---

## **🧠 Evaluation & AI Integrity**

At Seed28, we value transparency. If you use AI (ChatGPT, Copilot, etc.) to assist you, that’s fine—it’s a tool for modern engineers. However:

* **You must be able to explain the "Why":** During the interview, we will dive into your code. If you cannot explain the logic behind an AI-generated block, it will be a disqualifying factor.  
* **The Deep Dive:** Be prepared to discuss database indexing for the filters and how you would handle 100,000 bull records efficiently.

