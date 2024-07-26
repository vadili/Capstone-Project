# Capstone-Project-TechLink

Project Title: [TechLink]

Intern: [Chikodili Valerie Okeke]

Intern Manager: [Xiaoying Li]

Intern Director: [Carl Taylor]

Peer(s): [Yao Li & Xichan Liu]

GitHub Repository Link: [https://github.com/vadili?tab=repositories]

Docs link: https://docs.google.com/document/d/14sie1bPB0aDJwBRglfbTcDlu8tFEoHv7aqwpb_7YEHM/edit

Overview:[TechLink is an interactive app designed to bridge the gap between recruiters and college students from underrepresented backgrounds, lesser-known schools, and diverse genders. The app aims to provide these students with access to tech internships that they might not be aware of. Unlike typical professional networking platforms, TechLink facilitates direct communication between recruiters and students, ensuring more personalized and effective interactions.]

Category:[Social Networking]

Story:[TechLink allows students to create detailed profiles highlighting their skills, experiences, and career interests. Recruiters can create profiles showcasing their companies, available positions, and desired candidate qualifications. The app's searching capability then suggests potential matches, and the app facilitates direct communication between students and recruiters. This process helps students discover opportunities they might not have found on their own and enables recruiters to tap into a diverse talent pool.]

Market:[TechLink targets college students in tech from underrepresented backgrounds and lesser-known schools, as well as recruiters looking to diversify their talent pools.]

Habit:[Users are likely to use the app regularly, especially during recruitment seasons. Students will frequently check for new opportunities and interactions with recruiters, while recruiters will use the app to discover and connect with potential candidates.]

Scope:[TechLink's initial scope will focus on essential features like login, logout, and profile creation. These core functionalities will allow users to access the platform, create their profiles, and start building their presence. As we move beyond the MVP, we'll introduce more advanced features, such as keyword-based searching and real-time announcement. Some stretch goals include 1) real-time private chat, and 2) email subscriptions. By focusing on these additional features, we aim to enhance the user experience and provide more value to both students and recruiters on the platform.]

Product Spec

User Roles

Student: A college student in the tech field from an underrepresented college who is actively seeking internship opportunities.

Recruiter: An industry recruiter from a company looking to hire someone with skill sets and coming from an underrepresented background to diversify the company culture.

User Personas

Company Persona:

Name: Micheal
Company: Meta
Motivation: Find talented college students for internships at their company.

Student Persona 1:

	Name: Valerie
	Location: San Jose, California, USA
	Age: 19
	Technology Access: Proficient with computers and frequently visits the website to search for internships.
	Motivation: Valerie is a current sophomore computer science major  looking for summer internships related to software engineering. She wants to find internships in sync with her academic year and connect with recruiters.

Student Persona 2:

	Name: Favour
	Location: Los Angeles, California, USA
	Age: 21
	Technology Access: Prefers to use a smartphone and uses the mobile app to access internships and websites.
	Motivation: Favour is a rising senior data science major  looking for summer internships related to data science. He wants to connect with recruiters and explore internships.

User Stories

Required:

- As a student, I can login.
- As a student, I want to create a profile, so that I can showcase my skills and experiences to potential employers.
- As a student, I want to edit a profile or delete a profile
- As a student, I want to filter for internships to find opportunities that fit my profile.
- As a student, I want to view internship details, so I can make informed decisions before applying.
- As a student, I can receive real time announcements from the recruiters
- As a student, I want to view other students’ or recruiters’ profiles.


Stretched/Optional:

- As a student, I want to open a private chat room and send real-time messages to recruiters
- As a student, I want to be able to subscribe and get emails from recruiters.
- As a student, I can save and like internships.
- As a recruiter, I can see my created internships.
- As a user, I want to post on a timeline to share updates, achievements, and relevant information.
- As a user, I can upload a profile picture.


Screen Archetypes

- Login / Sign-up Screen
- Home Screen
	- Main page containing welcome messages
	- (with contact section about the app at the footer)
	- (stretch: if save internship feature is implemented, main page may contain the list of saved internship listings)
	- Search bar
	- Navigation bar (persisted across screens): profile icon, login/logout button, menu icon - dropdown, announcement icon
- Internship Search Results Screen
	- From the home screen, after input search keyword, the top K results are displayed in a list on the internship search results page based on document scores.
- Internship Details Screen
	- From the keyword search result, after clicking onto an internship listing, the details page is shown.
- Profile Screen
	- Contains logged-in user profile. Can be accessed via the navigation bar in home screen
- Announcement Screen
	- The recruiter can see the announcement creation screen; the students can see the announcement content after clicking on the notification icon in the top navigation bar.


Data Model

Student

- User_id: string
- First Name: string
- Last Name: string
- School: optional[string]
- GPA: optional[string] (Dropdown)
- Major: string (Dropdown)
- Gender: string (Dropdown)
- Race/Ethnicity: string (Dropdown)
- Technical skills: string (Dropdown)
- Previous Internships: optional[boolean]
- cookie/token - session management for login/logout
- User type - (1 if student, 0 if recruiter)

Recruiter

- User_id: string
- First Name: string
- Last Name: string
- Company: optional[string]
- Company Culture; optional[string]
- User type - (1 if student, 0 if recruiter)

Internship

- Job Id: string
- Job title: string
- Company name: string
- Job summary: string
- Job qualifications : list[string]
- Recruiter: string (user_id)

Announcement

- Sender: string (user_id)
- Content
- <other field>

Server Endpoints

- POST `/api/users/login` :Login user
- POST `/api/users/signup`  :Sign up a new user
- POST` /api/users/logout`: Logout user
- PUT `/api/users/profile` :Updates a user’s profile information
- POST `/api/users/internships` :Create a new internship listing
- DELETE `/api/users/profile` :Deletes a user’s profile information
- GET `/api/users/saved-jobs` :Retrieves a list of saved jobs
- GET `/api/users/liked jobs` :Retrieves a list of liked jobs


Navigation

- Login/Sign up: Allow users to login in or sign up for an account
- Welcome /About us Screen: Display welcome message for the user and general information about the site
	- Footer: Displays the contact information about the site
		- Details:
			- Location
			- Email
			- Phone Number
- Search result screen: Displays a list of internships
- Profile Screen: Displays the user’s profile information
	- May allow users to edit or delete their profile information
- Announcement Screen: Announcement shared by recruiters realtime


Technical Challenges

Technical Challenge #1 - Real-time Announcement

What

Build a real-time announcement system for recruiters. The recruiter user type can open an announcement page, and publish an event to all students currently logged in. The students will see a notification icon on their top navigation bar, with a number shown reflecting how many unread announcements there are. When clicking onto the notification, they can see the announcement content. 

How

Socket.IO is a JS library that supports real-time updates. Instead of having to refresh the page to refetch the new events, Socket.IO client listens to updates from the server in real-time and pushes updates to the changes to frontend. 

Some useful documentation/tutorial: 
- https://socket.io/how-to/use-with-react
- https://www.youtube.com/watch?v=djMy4QsPWiI

Some online example that can be used as a reference: 
- https://www.youtube.com/watch?v=7vVqMR96T5o

End goal & Validation 

- Test the feature behavior by logging in with two students on two opened browser pages, and one recruiter user. The goal is that
	- The recruiter can create a public announcement via an input form 
	- The two students can both receive the notification in real-time and click to view the announcement content. 
	- When one student is in a logged out state, and the recruiter sends an announcement. By the time the student logs back in, the student will see the notification she missed in her notification icons as well. 
	- When the notification is dismissed once, it no longer shows up as ‘unread’ again. 



Technical Challenge #2 - Simple Keywords-Based Searching 

What

Build a single keyword-based search system so that the student can search for a particular internship listing. Given the long list of internship listings, and the amount of texts in each listing, we want the users' searches for a single keyword to be super fast. And for the searches to be really fast, we want to have done most of the work before the user actually searches.

How

Build a keyword-based search system that takes in a single search keyword, and score each internship listing with: 
- 10 points if the keyword is in the title
- 1 point for every occurrence of the keyword in the listing body, up to 5 points

Then, when any new listing is added to the DB, calculate and cache on the server its score for every word in its listing. When the user enters a search term, just query the score cache to find the top listings to return. Handle any possible edge cases, like cleaning up the cache after every 10 minutes and updating the cache when new listings are created. 

Steps

Create a new table to store the caches, figuring out what the columns in that table should be, figuring out when to update the cache to make sure it's always correct, and then a bit of logic around actually running the cache update for a new listing -- looping over the content, hopefully not re-running the scoring for a repeat word


Database Integration: I've chosen to use Prisma with PostgreSQL and Express for my project, following what I learned at CodePath. Prisma's seamless integration with PostgreSQL and its ORM capabilities will streamline database management. PostgreSQL's strong ACID compliance and JSONB support fit well for structured data handling in my project. This setup ensures both efficiency and scalability as the project progresses.

External APIs: I will be integrating  internship APIs from platforms like RapidAPI and API list to import comprehensive internship listings into the app. These APIs offer a diverse selection of opportunities from various companies and locations, ensuring users have access to the latest and most relevant internship options. Specifically, I am exploring options such as the LinkedIn Jobs API and similar APIs available on platforms like RapidAPI and API lists.

Authentication


When users log into our app (POST `/api/users/login`), we check their credentials and issue a secure session token. This token is stored in an HTTP-only cookie, keeping it safe from any unauthorized access. It travels back and forth with each request, ensuring users stay authenticated as they navigate through different screens without needing to log in repeatedly.

For new users signing up (POST `/api/users/signup`), we securely add their details to our system, making sure they can smoothly move around the app without interruptions. When it's time to log out (POST /api/users/logout), we clear these tokens to maintain privacy and security.


Visuals and Interactions

Interesting Cursor Interaction: To enhance user experience, I will implement custom cursor interactions that change the cursor style when hovering over interactive elements like buttons and links. This will provide visual feedback to users, making the app feel more responsive and engaging.

UI Component with Custom Visual Styling: The app will feature UI components with custom visual styling. For example, the profile card on the Profile Screen will have a unique design with rounded corners, shadow effects, and personalized color schemes based on user preferences. This component will be built using CSS and styled-components to ensure maintainability and scalability.

Loading State: To handle loading states gracefully, I will implement loading spinners or skeleton screens. Whenever data is being fetched from the internships API or during login/signup processes, users will see a loading spinner or skeleton screen. These visual indicators will effectively communicate that content is loading, thereby enhancing the perceived performance of the app and keeping users informed about ongoing processes. This approach ensures a smoother user experience by reducing uncertainty and providing clear feedback during data retrieval and authentication operations.
