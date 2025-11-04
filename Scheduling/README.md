# TESTING STEPS.

First of all, I'm going to explain how this Scheduling works. 
- SchedulingAPI is a .NET web project.
- The purpose of this branch is to connect PROLOG with the previous Backend and C# code.
- Moodle IARTI files are already added to the folder.

There are two tests that we can make here:
    - C# --> PROLOG ( C# communicates with PROLOG )
    - SchedulingAPI --> BackendAPI ( SchedulingAPI communicates with BackendAPI )


## 1. Two terminals at the same time. (On the IARTI branch)

### First Terminal
- cd BackendAPI
- dotnet run
- Remind the port (It usually is 5000)


### Second Terminal
- cd Scheduling/SchedulingAPI
- dotnet run
- Remind the port, I already define 5107

## 2. Web browser

- To test that C# --> PROLOG it's working propperly: 
    - http://localhost:5107/api/Scheduling/test-prolog

-To test SchedulingAPI --> BackendAPI:
    - http://localhost:5107/api/Scheduling/test-api-call


( For any question/doubt, I reccomend you to take a look at SchedulingController, there you can see the methods done with the endpoints name, etc. )

( Aclaration: we are working with http, not https, so in Both folders (BackendAPI and SchedulingAPI) the line "app.UseHttpsRedirection();" in "Program.cs" or "Startup.cs" should be comment )