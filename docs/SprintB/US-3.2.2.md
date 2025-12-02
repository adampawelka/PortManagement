# User Story 3.1.2
As a System User, I want the system to automatically load my internal authorization role after authentication, so that I gain access only to my permitted features.

## 1. Overview
After login via the IAM (Auth0), the Single Page Application (SPA) must request the user’s internal role from the backend and render only the allowed menu items/features. If the role is missing or inactive, access must be denied with an appropriate message.


## 2. Tools

- **Framework**: React
- **Backend**: .NET
- **Routing**: React Router
- **Authentication**: Auth0
- **Testing**: Jest for unit tests
- **Styling**: CSS
- **API Communication**: Fetch

## 3. Functional Requirements

### 3.1 Authentication

- Users log in via IAM (Auth0).
- The system identifies the user using their unique IAM identifier.

### 3.2 Role Retrieval

- After login, the system retrieves the user’s internal role from the backend.
- The backend validates the user and ensures the role is active.

### 3.3 Menu and Feature Rendering

- Only features allowed for the retrieved role are visible to the user.
- All menus, submenus, and actions are filtered according to the role.

### 3.4 Access Control

If the role is missing or inactive:
- The user is shown an Access Denied message.
- Navigation options are hidden or disabled.

## 4. Testing

### 4.1 Unit Testing

**Role Retrieval Logic**
- Verify that after login, the system correctly identifies the IAM user and retrieves their internal role.
- Test different scenarios: active role, inactive role, missing role.

**Menu Rendering**
- Confirm that menu items and features are displayed or hidden according to the retrieved role.
- Validate that submenus are correctly filtered based on permissions.

**Access Denial Handling**
- Ensure that users without a valid role cannot access protected pages or actions.
- Verify that an appropriate message (“Access Denied”) is displayed.

### Integration Testing 

**Component Interaction**
- Test that the SPA and backend communicate correctly to fetch role information.
- Validate that role-based filtering logic in the frontend correctly interprets backend responses.

**Role Status Handling**
- Ensure the frontend handles inactive or missing roles appropriately.
- Confirm that protected features remain inaccessible when backend enforces role restrictions.

## 5. Demonstration
Run the Port Management application in web browser with `http://localhost:5173`and backend with `http://localhost:5000`.

## 6. Observations

The system correctly shows or hides menu items and features based on the internal user role. Users only see the options they are authorized to access. Users with missing or inactive roles are properly restricted from accessing features, reducing the risk of unauthorized actions. Backend validation ensures that roles cannot be bypassed by manipulating the frontend. Both frontend and backend checks are required for secure role enforcement.
Future improvements could include caching roles for faster SPA rendering and real-time role updates.
