# User Story 3.1.2
As a System User, I want the SPA to provide a unified layout, so that navigation is consistent across the application.

## 1. Overview
The goal is to provide a consistent and unified layout across the entire SPA to enhance usability and navigation clarity. This layout ensures essential UI components are always accessible, adapts to user roles dynamically, supports multilingual interfaces, and maintains responsive design principles.

## 2. Tools

- **Framework**: React
- **Routing**: React Router
- **Localization**: i18next
- **Testing**: Jest for unit tests
- **Styling**: CSS

## 3. Features
#### Mandatory Elements
- **Header Bar** - displays the system or company logo and name prominently. Always visible regardless of the page or application state.
- **Primary Navigation Area** - can be implemented as a top menu, side menu, or an equivalent navigation component. Must remain visible at all times to ensure consistent navigation access.

#### Optional Elements (Enhancements)
- **Secondary Navigation**-includes submenus, breadcrumbs, or other context-specific navigation aids.
- **Additional Interface Sections:** sidebar, footer - improve user experience and provide auxiliary information.

#### Responsive design
- desktop first layout
- adapts to tablet and mobile screens

#### Consistent UI
- Styled with a unified design system or component library.
- Ensures consistent typography, colors, and spacing across all pages.

## 4. Testing

Tests were conducted on the development version that's why the code for the tests won't run on the final version.

### 4.1 Unit Testing

**Header Component:**
- Tested that the logo and app name were rendered correctly.
- Ensured that the primary navigation links (like Home, About, etc.) were visible and functioning as expected.

**Primary Navigation:**
- Verified that the Primary Navigation component was always visible and contained the correct links based on user roles (Admin, User).
- Tested responsiveness to ensure that the layout adapted correctly for tablet and mobile screens.

**Language Switcher:**
- Verified that the language switcher button rendered correctly.
- Ensured that clicking the language switcher button toggled between languages (EN/PT) and updated the UI components accordingly.

### 4.2 Integration Testing 

**Role-Based Navigation:**
- Verified that different user roles (e.g., Admin, User) saw the correct navigation links.
- Admin users had access to additional sections like Docks, while regular users only saw standard content.

Disclaimer: Since the tests were implemented in the last stages, the authorization had been already implemented, that's why login was a part of the testing.

## 5. Demonstration
Run the Port Management application in web browser with `http://localhost:5173`

## 6. Observations

Menu and navigation should be tested with multiple roles to ensure proper visibility. Language switching should be seamless with no page reloads required. Design system ensures visual consistency but must be maintained as new components are added. 
Future improvements may include collapsible navigation on small screens.