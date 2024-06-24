# Capstone-Project-FindME

Project Title: [FINDME]

Intern: [Chikodili Valerie Okeke]

Intern Manager: [Xiaoying Li]

Intern Director: [Carl Taylor]

Peer(s): [Yao Li & Xichan Liu]

GitHub Repository Link: [https://github.com/vadili?tab=repositories

Docs link: https://docs.google.com/document/d/14sie1bPB0aDJwBRglfbTcDlu8tFEoHv7aqwpb_7YEHM/edit 

Overview:[FindMe is an interactive app designed to bridge the gap between recruiters and college students from underrepresented backgrounds, lesser-known schools, and diverse genders. The app aims to provide these students with access to tech internships that they might not be aware of. Unlike typical professional networking platforms, FindMe facilitates direct communication between recruiters and students, ensuring more personalized and effective interactions.]

Category:[Social Networking]

Story:[FindMe allows students to create detailed profiles highlighting their skills, experiences, and career interests. Recruiters can create profiles showcasing their companies, available positions, and desired candidate qualifications. The app's matching algorithm then suggests potential matches, facilitating direct communication between students and recruiters. This process helps students discover opportunities they might not have found on their own and enables recruiters to tap into a diverse talent pool.]

Market:[FindMe targets college students in tech from underrepresented backgrounds and lesser-known schools, as well as recruiters looking to diversify their talent pools.]

Habit:[Users are likely to use the app regularly, especially during recruitment seasons. Students will frequently check for new opportunities and interactions with recruiters, while recruiters will use the app to discover and connect with potential candidates.]

Scope:[Initially, FindMe will focus on providing a platform for profile creation and messaging between students and recruiters. The scope will include functionalities like login, account creation, profile management, and basic communication features. Advanced features like real-time chat with timestamp  and multimedia content sharing.]

FindMe Matching System Overview

FindMe utilizes a machine learning algorithm to facilitate personalized and effective connections between students and recruiters. By leveraging comprehensive profiles and detailed questionnaires, the platform ensures that each match is tailored to the specific needs and preferences of both parties. Here's an in-depth look at how the system operates:

Questionnaire-Based Matching:

Data Collection:

Student Profiles: 
- Skills (Both hard and soft)
- Academic achievements (e.g. GPA, major)
- Career interests
- Personal Backgrounds
- Extracurricular activities
- Previous Internships or projects

Recruiter Profiles:
- Company
- Desired candidate qualifications 
- Company Culture
- Diversity initiatives

Matching Criteria and Weighting

- Skills and Qualifications: The matching algorithm aligns students' hard skills (e.g., technical competencies, software proficiency) and soft skills (e.g., communication, teamwork) with the job requirements specified by recruiters.

- Experience and Achievements: Factors such as internships, projects, volunteer experiences, and academic achievements are considered to gauge a student's readiness and suitability for specific roles.

- Cultural and Diversity Fit: The algorithm takes into account preferences related to company culture, values, and diversity initiatives to ensure that students' expectations align with recruiters' offerings.

Benefits of FindMe's Matching Algorithm

- Tailored Connections: The detailed profiles and questionnaires ensure that the matches are highly personalized, leading to more meaningful and productive connections between students and recruiters.

- Enhanced Recruitment Outcomes: By aligning skills, experiences, and cultural fit, the platform increases the likelihood of successful hires and positive recruitment experiences.

- Support for Diversity Initiatives: FindMe promotes opportunities for underrepresented groups and lesser-known schools, supporting diversity and inclusion within the recruitment process.

By employing a machine learning algorithm and leveraging detailed data from both students and recruiters, FindMe creates a robust and efficient matching system that benefits all parties involved.

Product Spec

User Stories

User Roles

Student: A college student in the tech field  from an underrepresented college who is actively seeking internship opportunities .

Recruiter: A person from a company looking for talented students from underrepresented colleges to help diversify his company.

User Personas

Company Persona:

Name: Micheal
Company: Meta
Motivation: Find talented college students for internships at their company.

Student Persona 1:

	Name: Valerie 
	Location: San Jose, California, USA
	Age: 19
	Technology Access: Proficient with computers and frequently visits the website                      to search for internships.
	Motivation: Valerie is a current sophomore computer science major  looking for summer internships related to software engineering. She wants to find internships in sync with her academic year and connect with recruiters. 

Student Persona 2: 

	Name: Favour
	Location: Los Angeles, California, USA
	Age: 21
	Technology Access: Prefers to use a smartphone and uses the mobile app to access internships and websites. 
	Motivation: Favour is a rising senior data science major  looking for summer internships related to data science. He wants to connect with recruiters and explore internships.

User Stories

Required: 

- As a student or recruiter, I can login.
- As a student, I want to create a profile, so that I can showcase my skills and experiences to potential employers.
- As a student, I want to search for internships, so I can find opportunities that match my interests. 
- As a student, I want to view internship details, so I can make informed decisions before applying.
- As a student, I want to reach out to the recruiters of specific companies, so I can ask for more insight about the recruiting process.
- As a student or recruiter, I want to view other people’s profiles. 
- As a recruiter, I want to view student profiles, so I can reach out to the best fits. 
- As a recruiter, I want to give students feedback about their resumes, so they can improve them  and apply for available positions at my company. 

Stretched/Optional:

- As a student, I want to save internships and like internships boards, so I can come back to them later.
- As a student, I want to be able to edit\delete my profile information.
- As a student or recruiter, I want to get notifications of chat messages. 

Screen Archetypes

- Home Screen
- Profile Screen
- About us Screen
- Contact Screen
- Chat Screen


Data Model

User: 
- First Name 
- Last Name
- Email
- School
- Gender
- Race/Ethnicity

Internship Listing:
- Job Id
- Job title
- Company name
- Job summary
- Job qualifications 

Navigation

- Login/Sign up: Allow users to login in or sign up for an account
- Home Screen: Displays a list of internships 
- Profile Screen: Displays the user’s profile information 
    - May allow users to edit or delete their profile information
- About us Screen: Displays general information about the site
- Contact Screen: Displays the contact information about the site
    - Details:
         - Location 
         - Email
         - Phone Number
- Chat Screen: Displays a list of people you  message and allows you to open their chats. 
    - Messages appear instantly on both users’ screen upon sending 
    - Messages are displayed with timestamps indicating when they are sent

Database Integration: After extensive research, I've selected MongoDB as the database for my project due to its excellent integration with Node.js and its flexible document-based structure. MongoDB's ability to handle unstructured data, such as internship listings from diverse APIs, with ease and efficiency is particularly advantageous. It offers scalability through native support for horizontal scaling and a dynamic schema that facilitates rapid iteration. While PostgreSQL offers robust features like JSONB for efficient querying and ACID compliance for transactional integrity, MongoDB's strengths in scalability, schema flexibility, and performance for document-oriented data align more closely with the needs of my project. These considerations led me to choose MongoDB as the optimal database solution for ensuring both flexibility and performance in handling the project's data requirements.

External APIs: I will be integrating  internship APIs from platforms like RapidAPI and API list to import comprehensive internship listings into the app. These APIs offer a diverse selection of opportunities from various companies and locations, ensuring users have access to the latest and most relevant internship options. Specifically, I am exploring options such as the LinkedIn Jobs API and similar APIs available on platforms like RapidAPI and API lists

Visuals and Interactions

Interesting Cursor Interaction: To enhance user experience, I will implement custom cursor interactions that change the cursor style when hovering over interactive elements like buttons and links. This will provide visual feedback to users, making the app feel more responsive and engaging.

UI Component with Custom Visual Styling: The app will feature UI components with custom visual styling. For example, the profile card on the Profile Screen will have a unique design with rounded corners, shadow effects, and personalized color schemes based on user preferences. This component will be built using CSS and styled-components to ensure maintainability and scalability.

Loading State: To handle loading states gracefully, I will implement loading spinners or skeleton screens. Whenever data is being fetched from the internships API or during login/signup processes, users will see a loading spinner or skeleton screen. These visual indicators will effectively communicate that content is loading, thereby enhancing the perceived performance of the app and keeping users informed about ongoing processes. This approach ensures a smoother user experience by reducing uncertainty and providing clear feedback during data retrieval and authentication operations.





