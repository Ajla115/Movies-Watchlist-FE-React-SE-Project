- This is a repository for the frontend of my project called Movies Watchlist. 
- Frontend was built using React. 
- Additionally, tests were written using Jest and React Testing Library.
- Backend was built using Spring, and it can be found in the backend repository 
(https://github.com/Ajla115/Movie-Watchlist-BE-Spring-SE-Project.git)
- Full project documentation can be found in the file "Movies_Watchlist_SRS_Documentation.pdf".
- Besides this, screenshots folder contains screenshots of the project.
- In the applicationFlowVideos folder, you can find videos that show applications flow.
- Applicaion has two external interfaces implemented:
    1. Email Sending Service - sends emails with new movie suggestions form the same genre, when the movie gets marked as "Watched", if the notifications are not disabled.
    2. OPENAI API - recommends a genre for the movie based on the title when adding a new movie. Also, it suggest five similiar movies from the same genre to be sent as email recommendation.
- Application was deployed using Render. 