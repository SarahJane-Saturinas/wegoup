# Requirements Traceability Matrix (RTM)

| Category               | Home Module                                                                                     | Auth Sign-In Module                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| ID                     | 1                                                                                              | 2                                                                                                  |
| BR ID                  | BR-001                                                                                        | BR-002                                                                                            |
| Business Requirements   | Enable users to join the tree planting community                                               | Allow users to authenticate and access dashboard                                                   |
| FR ID                  | FR-001                                                                                        | FR-002                                                                                            |
| Functional Requirements | Display landing page with community info and motivational quotes                              | Provide sign-in functionality with redirect to dashboard                                          |
| US ID                  | US-001                                                                                        | US-002                                                                                            |
| User Story             | As a visitor, I want to see a welcoming landing page so that I feel motivated to join          | As a user, I want to sign in so that I can access my dashboard                                    |
| Acceptance Criteria    | Landing page displays community message, random motivational quote, and sign-in option         | Sign-in page allows user to authenticate and redirects to dashboard upon success                   |
| Status                 | Completed                                                                                    | Completed                                                                                        |

## Modules Pending RTM Entries

| Category               | Admin Module                                                                                   | API Module                                                                                      | Chat Module                                                                                      |
|------------------------|------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| ID                     | 3                                                                                              | 4                                                                                              | 5                                                                                              |
| BR ID                  | BR-003                                                                                        | BR-004                                                                                        | BR-005                                                                                        |
| Business Requirements   | Restrict access to admin users only                                                            | Provide backend API endpoints for various features                                            | Provide interactive chat support about plants                                                  |
| FR ID                  | FR-003                                                                                        | FR-004                                                                                        | FR-005                                                                                        |
| Functional Requirements | Check user role and redirect unauthorized users                                                | Implement API endpoints for chat, users, events, friends, plants, posts, progress, stats, etc. | Chat UI with message input, display, and API integration                                       |
| US ID                  | US-003                                                                                        | US-004                                                                                        | US-005                                                                                        |
| User Story             | As an admin, I want to access the admin page and be restricted if not authorized                | As a user, I want to use various backend services to support app features                      | As a user, I want to chat with PlantBot to get plant-related answers                           |
| Acceptance Criteria    | Only users with admin role can see the admin page; others are redirected                        | API endpoints respond correctly to requests and support app functionality                      | Chat UI works, messages sent and received correctly, error handling in place                   |
| Status                 | Completed                                                                                    | In Progress                                                                                   | Completed                                                                                    |

| Category               | Community Module                                                                              |
|------------------------|----------------------------------------------------------------------------------------------|
| ID                     | 6                                                                                            |
| BR ID                  | BR-006                                                                                      |
| Business Requirements   | Enable community interaction through posts and social features                              |
| FR ID                  | FR-006                                                                                      |
| Functional Requirements | Display posts feed, allow post submission, handle loading and error states                  |
| US ID                  | US-006                                                                                      |
| User Story             | As a user, I want to view and post in the community feed to engage with others              |
| Acceptance Criteria    | Posts load correctly, users can submit posts, errors are handled gracefully                  |
| Status                 | Completed                                                                                  |

| Category               | Dashboard Module                                                                             |
|------------------------|----------------------------------------------------------------------------------------------|
| ID                     | 7                                                                                            |
| BR ID                  | BR-007                                                                                      |
| Business Requirements   | Provide users with a personalized dashboard to track their tree planting impact             |
| FR ID                  | FR-007                                                                                      |
| Functional Requirements | Display tree count, location count, badges, tips, quick actions, and community progress     |
| US ID                  | US-007                                                                                      |
| User Story             | As a user, I want to see my tree planting stats and relevant tips on my dashboard           |
| Acceptance Criteria    | Dashboard loads user data correctly, displays stats and tips, and provides navigation       |
| Status                 | Completed                                                                                  |

| Category               | Identify Module                                                                             |
|------------------------|----------------------------------------------------------------------------------------------|
| ID                     | 8                                                                                            |
| BR ID                  | BR-008                                                                                      |
| Business Requirements   | Enable users to identify plants using AI based on description                               |
| FR ID                  | FR-008                                                                                      |
| Functional Requirements | Input description, submit to API, display results or errors                                |
| US ID                  | US-008                                                                                      |
| User Story             | As a user, I want to identify plants by describing them to get AI-based results            |
| Acceptance Criteria    | Input validation, API call, result display, error handling                                 |
| Status                 | Completed                                                                                  |

| Category               | Newsfeed Module                                                                            |
|------------------------|----------------------------------------------------------------------------------------------|
| ID                     | 9                                                                                            |
| BR ID                  | BR-009                                                                                      |
| Business Requirements   | Provide users with a newsfeed of posts                                                     |
| FR ID                  | FR-009                                                                                      |
| Functional Requirements | Fetch and display posts, handle loading and errors                                         |
| US ID                  | US-009                                                                                      |
| User Story             | As a user, I want to see a newsfeed of posts to stay updated                               |
| Acceptance Criteria    | Posts load and display correctly, loading and error states handled                         |
| Status                 | Completed                                                                                  |

| Category               | Not Authorized Module                                                                     |
|------------------------|----------------------------------------------------------------------------------------------|
| ID                     | 10                                                                                           |
| BR ID                  | BR-010                                                                                      |
| Business Requirements   | Inform users when they are not authorized to access a page                                 |
| FR ID                  | FR-010                                                                                      |
| Functional Requirements | Display an unauthorized access message                                                    |
| US ID                  | US-010                                                                                      |
| User Story             | As a user, I want to be informed if I try to access a restricted page                      |
| Acceptance Criteria    | Unauthorized message is displayed clearly                                                |
| Status                 | Completed                                                                                  |

| Category               | Planting Module                                                                            |
|------------------------|----------------------------------------------------------------------------------------------|
| ID                     | 11                                                                                           |
| BR ID                  | BR-011                                                                                      |
| Business Requirements   | Allow users to record tree planting activities                                             |
| FR ID                  | FR-011                                                                                      |
| Functional Requirements | Form input, validation, save to database, success/error handling                           |
| US ID                  | US-011                                                                                      |
| User Story             | As a user, I want to log my tree planting activities to track my impact                    |
| Acceptance Criteria    | Form submits data correctly, shows success or error messages, redirects on success         |
| Status                 | Completed                                                                                  |

| Category               | Plants Module                                                                             |
|------------------------|----------------------------------------------------------------------------------------------|
| ID                     | 12                                                                                           |
| BR ID                  | BR-012                                                                                      |
| Business Requirements   | Provide users with a plant database for exploration and education                          |
| FR ID                  | FR-012                                                                                      |
| Functional Requirements | Search, filter by category, display plant details, and AI Plant ID integration            |
| US ID                  | US-012                                                                                      |
| User Story             | As a user, I want to explore plants with care tips and identify plants using AI           |
| Acceptance Criteria    | Plants display correctly, search and filter work, AI Plant ID button present              |
| Status                 | Completed                                                                                  |

*Note: This RTM will be updated as more modules are analyzed and requirements are gathered.*
