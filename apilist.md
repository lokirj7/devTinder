# DevTinder api

authRouter(for authentication oriented process)
- POST /signup
- POST /login
- POST /logout

profileRouter(this for the purpose of profile)
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

connectRequestRouter(this for main use case purpose)
- POST /request/send/intersted/:userId
- POST /request/send/ignored/:userID
- POST /request/review/accepted/:requestID
- POST /request/review/rejected/:rejectedID


- GET /user/connections
- GET /requests/received
- GET /feed - Gets you profile all the user when user loads


When new User enter
- Onboard them