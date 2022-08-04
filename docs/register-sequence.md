# User Register Sequence Diagram

## User registration by email

```plantuml
actor Customer as customer #red
control UserController as controller
participant UserService as service
database redis as redis #red
participant EventService as eventService #orange

autonumber "(**0**)"
customer->controller:byEmail(email,password)
controller->service:registerByEmail(email,password)
service->service:Generate confirm code
service->redis:createUser(email,pass,code,Now)
service->eventService:userRegisteredByEmailEvent\n(Email Service)
eventService-->service:emailSentEvent\n(Email Service)
group If email failed
  service->redis:removeUser(email)
end

service-->controller:Success/Failure
controller-->customer:Success/Failure
```

---

## User email confirmation

```plantuml
actor Customer as customer #red
control UserController as controller
participant UserService as service
participant UserRepository as userRepository #lightblue
database Postgress as postgres #336791
database redis as redis #red
participant EventService as eventService #orange

autonumber "(**0**)"
customer->controller:confirmEmail\n(email,code,password)
controller->service:confirmEmail\n(email,code,password)
service<--redis:getUser(email)
service->service:Check code
service->userRepository:createUser\n(email,password,disabled)
userRepository->postgres:Create user\nas disabled
userRepository<--postgres:Get user
userRepository-->service:Send new user info
service->eventService:UserCreatedEvent\n(Auth Service)

eventService-->service:Generated user token\n(Auth Service)
service-->controller:Return token
controller-->customer:Return token
```

---

## Update user profile

```plantuml
actor Customer as customer #red
control UserController as controller
participant UserService as service
participant UserRepository as userRepository #lightblue
database Postgress as postgres #336791
participant EventService as eventService #orange

autonumber "(**0**)"
customer->controller:updateUser(UserDto)
controller->service:updateUser(UserDto)
service->userRepository:updateUser(User)
userRepository->postgres:Update User Table
postgres-->userRepository:Success
userRepository-->service:newUser
group If auth fields are changed
service->eventService:UserUpdatedEvent(newUser)\n(Auth Service)
end
service-->controller:newUser
controller-->customer:newUser
```

## Update user email

```plantuml
actor Customer as customer #red
control UserController as controller
participant UserService as service
database redis as redis #red
participant EventService as eventService #orange

autonumber "(**0**)"
customer->controller:updateEmail(email)
controller->service:updateEmail(email)
service->service:Generate confirm code
service->redis:updateEmailRequest(email,code,Now)
service->eventService:userUpdatedEmailEvent\n(Email Service)
eventService-->service:emailSentEvent\n(Email Service)
group If email failed
  service->redis:removeEmailUpdate(email)
end

service-->controller:Success/Failure
controller-->customer:Success/Failure
```

## User email update confirmation

```plantuml
actor Customer as customer #red
control UserController as controller
participant UserService as service
participant UserRepository as userRepository #lightblue
database Postgress as postgres #336791
database redis as redis #red
participant EventService as eventService #orange

autonumber "(**0**)"
customer->controller:confirmEmailUpdate\n(email,code)
controller->service:confirmEmailUpdate\n(email,code)
service<--redis:getEmailUpdateRequest(email)
service->service:Check code
service->userRepository:updateEmail(email)
userRepository->postgres:update email
userRepository-->service:Success

service->eventService:EmailUpdateEvent(uuid, email)\n(Auth Service)
eventService-->service:SuccessResponse\n(Auth Service)

service-->controller:Return success
controller-->customer:Return success
```

## Forget password process

```plantuml
actor Customer as customer #red
control UserController as controller
participant UserService as service
' participant UserRepository as userRepository #lightblue
database UserRepository as userRepository #336791
database redis as redis #red
participant EventService as eventService #orange

autonumber "(**0**)"

note over customer
- Frontend defines a callback url
  In ENV file of the backend service
endnote

customer -> controller : forgotPassword\n(email)
controller -> service : forgotPassword\n(email)
service -> service : Geenrate random code\n(Should be long enouph)
service -> redis : Save code & email
service -> eventService : Send email(url, code, templateCode)\n**{callbackUrl}/?code={code}**
service --> controller : Success
controller --> customer : Success

note over customer
  - Customer clicks on callback url
  - FrontEnd retrives the new password
  - Sends the code & new password
endnote 

customer -> controller : forgotPassword\n(password, code)
controller -> service : forgotPassword\n(password, code)
service <- redis : Get email for this code
service <- userRepository : Check email existence
' userRepository -> postgres : Check email existence
service -> userRepository : Update password
' userRepository -> postgres : Update\npassword
service --> controller : Success
controller --> customer : Success
```
