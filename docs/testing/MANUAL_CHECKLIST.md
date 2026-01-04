# Manual Testing Checklist

This checklist provides a comprehensive manual testing guide for the Meal Planner Agent application. Use this to ensure all features work correctly across different pages and scenarios.

## Testing Instructions

- [ ] Test on desktop browsers: Chrome, Firefox, Safari
- [ ] Test on mobile: Safari iOS, Chrome Android
- [ ] Use real user credentials or test accounts
- [ ] Check all interactive elements
- [ ] Verify error handling and edge cases

---

## 1. Landing Page (`/`)

### Visual Elements
- [ ] Page loads without errors
- [ ] Hero section displays correctly
- [ ] Navigation bar is visible and aligned
- [ ] All images load properly
- [ ] Responsive layout works on mobile

### Interactive Elements
- [ ] "Get Started" button navigates to register page
- [ ] "Sign In" button navigates to login page
- [ ] All links in navigation work correctly
- [ ] Hover states work on buttons

### Expected Behaviors
- [ ] Unauthenticated users see landing page
- [ ] Authenticated users are redirected to dashboard
- [ ] Page is SEO-friendly (meta tags, titles)

### Edge Cases
- [ ] Works on slow network connections
- [ ] Handles JavaScript disabled gracefully

---

## 2. Login Page (`/login`)

### Visual Elements
- [ ] Login form displays correctly
- [ ] Email and password inputs are visible
- [ ] "Sign In" button is visible
- [ ] "Register" link is visible

### Interactive Elements
- [ ] Email input accepts valid email format
- [ ] Password input masks characters
- [ ] "Show password" toggle works (if implemented)
- [ ] "Sign In" button is clickable
- [ ] "Register" link navigates to register page

### Expected Behaviors
- [ ] Valid credentials log user in successfully
- [ ] User is redirected to dashboard after login
- [ ] Session persists on page refresh
- [ ] "Remember me" checkbox works (if implemented)

### Error Scenarios
- [ ] Invalid email shows error message
- [ ] Wrong password shows error message
- [ ] Non-existent user shows error message
- [ ] Empty fields show validation errors
- [ ] Network errors are handled gracefully

### Edge Cases
- [ ] SQL injection attempts are blocked
- [ ] XSS attempts are blocked
- [ ] Rate limiting works for failed attempts

---

## 3. Register Page (`/register`)

### Visual Elements
- [ ] Registration form displays correctly
- [ ] Name, email, password inputs are visible
- [ ] "Create Account" button is visible
- [ ] "Sign In" link is visible

### Interactive Elements
- [ ] Name input accepts text
- [ ] Email input validates email format
- [ ] Password input has strength indicator (if implemented)
- [ ] Password confirmation matches password
- [ ] "Create Account" button is clickable
- [ ] "Sign In" link navigates to login page

### Expected Behaviors
- [ ] New user account is created successfully
- [ ] User is redirected to preferences setup or dashboard
- [ ] Welcome email is sent (if implemented)
- [ ] Password is hashed (verify in database)

### Error Scenarios
- [ ] Duplicate email shows error message
- [ ] Weak password is rejected
- [ ] Password mismatch shows error
- [ ] Empty fields show validation errors
- [ ] Invalid email format shows error

### Edge Cases
- [ ] Very long names/emails are handled
- [ ] Special characters in password work
- [ ] Unicode characters in name are supported

---

## 4. Dashboard Page (`/dashboard`)

### Visual Elements
- [ ] Dashboard layout displays correctly
- [ ] Welcome message shows user's name
- [ ] Statistics cards display (total plans, last generated, etc.)
- [ ] Recent meal plans list is visible
- [ ] Quick action buttons are visible

### Interactive Elements
- [ ] "Generate New Plan" button navigates to generate page
- [ ] "View All Plans" button navigates to meal plans list
- [ ] Recent meal plans are clickable
- [ ] Navigation links work correctly

### Expected Behaviors
- [ ] Authenticated users see their data
- [ ] Unauthenticated users are redirected to login
- [ ] Statistics reflect actual user data
- [ ] Loading states show while fetching data

### Error Scenarios
- [ ] No meal plans shows empty state message
- [ ] API errors show error message
- [ ] Network errors are handled gracefully

### Edge Cases
- [ ] New user with no data sees appropriate message
- [ ] User with many plans sees pagination/scroll
- [ ] Concurrent updates are handled

---

## 5. Generate Page (`/generate`)

### Visual Elements
- [ ] Generation form displays correctly
- [ ] Week start date picker is visible
- [ ] Preferences summary is shown
- [ ] "Generate Plan" button is visible

### Interactive Elements
- [ ] Date picker allows selecting future dates
- [ ] Date picker prevents past dates
- [ ] "Edit Preferences" link navigates to preferences
- [ ] "Generate Plan" button is clickable

### Expected Behaviors
- [ ] Plan generation job is queued successfully
- [ ] User sees success message
- [ ] User is redirected to meal plans list or detail page
- [ ] Processing status is visible

### Error Scenarios
- [ ] No preferences set shows warning
- [ ] API errors show error message
- [ ] Duplicate week shows error
- [ ] Invalid date shows error

### Edge Cases
- [ ] Multiple rapid submissions are prevented
- [ ] Very far future dates are handled
- [ ] User closes browser during generation

---

## 6. Meal Plans List Page (`/meal-plans`)

### Visual Elements
- [ ] Meal plans table/grid displays correctly
- [ ] Status badges show (PENDING, PROCESSING, COMPLETED, FAILED)
- [ ] Week dates are formatted correctly
- [ ] Pagination controls are visible (if applicable)

### Interactive Elements
- [ ] Each meal plan is clickable
- [ ] Status filter works (if implemented)
- [ ] Search works (if implemented)
- [ ] Sort by date works (if implemented)
- [ ] Pagination works (if applicable)

### Expected Behaviors
- [ ] All user's meal plans are listed
- [ ] Most recent plans appear first
- [ ] Status colors are distinct
- [ ] Loading states show while fetching

### Error Scenarios
- [ ] No meal plans shows empty state
- [ ] API errors show error message
- [ ] Failed plans show error details

### Edge Cases
- [ ] User with 100+ plans sees pagination
- [ ] Long-running PROCESSING plans are indicated
- [ ] Refresh updates statuses

---

## 7. Meal Plan Detail Page (`/meal-plans/[id]`)

### Visual Elements
- [ ] Meal plan header shows week and status
- [ ] Individual meals are displayed in order
- [ ] Each meal shows name, ingredients, nutrition
- [ ] Instructions are formatted correctly
- [ ] Print view is available (if implemented)

### Interactive Elements
- [ ] Back to list button works
- [ ] "Send Email" button works (if implemented)
- [ ] "Delete Plan" button works (if implemented)
- [ ] Copy recipe buttons work (if implemented)
- [ ] Expand/collapse meal details work

### Expected Behaviors
- [ ] All meals for the week are shown
- [ ] Nutrition information is accurate
- [ ] Ingredients list is complete
- [ ] Instructions are numbered/ordered

### Error Scenarios
- [ ] Non-existent plan ID shows 404
- [ ] Unauthorized access is prevented
- [ ] PROCESSING plan shows loading state
- [ ] FAILED plan shows error message

### Edge Cases
- [ ] Very long ingredient lists display well
- [ ] Many-step recipes are readable
- [ ] Special characters in recipes render correctly

---

## 8. Analytics Page (`/analytics`)

### Visual Elements
- [ ] Charts/graphs display correctly
- [ ] Date range selector is visible
- [ ] Statistics cards show metrics
- [ ] Responsive layout works on mobile

### Interactive Elements
- [ ] Date range selector updates data
- [ ] Chart hover tooltips work
- [ ] Export/download works (if implemented)
- [ ] Filter controls work (if implemented)

### Expected Behaviors
- [ ] Charts reflect actual user data
- [ ] Data is accurate and up-to-date
- [ ] Loading states show while fetching
- [ ] Empty state for no data

### Error Scenarios
- [ ] API errors show error message
- [ ] No data shows appropriate message

### Edge Cases
- [ ] Large datasets perform well
- [ ] Edge case dates are handled

---

## 9. Preferences Page (`/preferences`)

### Visual Elements
- [ ] Preferences form displays correctly
- [ ] All input fields are visible
- [ ] Current values are pre-populated
- [ ] Save button is visible

### Interactive Elements
- [ ] Meal count slider/input works
- [ ] Serving size input works
- [ ] Dietary restrictions checkboxes work
- [ ] Protein preferences multi-select works
- [ ] Target calories input validates numbers
- [ ] Email recipients input accepts multiple emails
- [ ] Schedule toggle works
- [ ] "Save" button is clickable

### Expected Behaviors
- [ ] Current preferences are loaded
- [ ] Changes are saved successfully
- [ ] Success message is shown
- [ ] Form resets on cancel (if implemented)

### Error Scenarios
- [ ] Invalid meal count shows error
- [ ] Invalid calorie target shows error
- [ ] Invalid email format shows error
- [ ] API errors show error message

### Edge Cases
- [ ] Very large meal counts are handled
- [ ] Zero serving size is prevented
- [ ] Long dietary restriction lists display well
- [ ] Multiple email recipients are validated

---

## Cross-Functional Tests

### Authentication Flow
- [ ] User can register → login → access dashboard
- [ ] User can logout successfully
- [ ] Session expires after timeout
- [ ] "Remember me" persists session
- [ ] Password reset flow works (if implemented)

### Authorization Checks
- [ ] Users can only see their own data
- [ ] Direct URL access to other user's plans is blocked
- [ ] API endpoints enforce authorization
- [ ] Admin features are restricted (if applicable)

### Data Integrity
- [ ] Meal plan generation creates correct number of meals
- [ ] Meal records match preferences
- [ ] Nutrition calculations are accurate
- [ ] Database constraints are enforced

### Error Handling
- [ ] Network failures show user-friendly messages
- [ ] API errors don't crash the app
- [ ] 404 pages are user-friendly
- [ ] 500 errors are logged and handled

### Performance Checks
- [ ] Pages load within 3 seconds
- [ ] Large lists are paginated
- [ ] Images are optimized
- [ ] Database queries are efficient
- [ ] No memory leaks on long sessions

---

## Browser Compatibility Testing

### Desktop Browsers

#### Chrome (Latest)
- [ ] All pages render correctly
- [ ] All features work
- [ ] No console errors

#### Firefox (Latest)
- [ ] All pages render correctly
- [ ] All features work
- [ ] No console errors

#### Safari (Latest)
- [ ] All pages render correctly
- [ ] All features work
- [ ] No console errors

### Mobile Browsers

#### Safari iOS (iPhone)
- [ ] Responsive layout works
- [ ] Touch interactions work
- [ ] Forms are usable
- [ ] No horizontal scrolling

#### Chrome Android
- [ ] Responsive layout works
- [ ] Touch interactions work
- [ ] Forms are usable
- [ ] No horizontal scrolling

---

## Accessibility Testing

- [ ] Keyboard navigation works on all pages
- [ ] Screen reader announces elements correctly
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG standards
- [ ] Forms have proper labels
- [ ] Error messages are announced
- [ ] Alt text on images

---

## Security Testing

- [ ] HTTPS is enforced
- [ ] CSRF protection is enabled
- [ ] XSS attempts are blocked
- [ ] SQL injection attempts are blocked
- [ ] Passwords are never exposed in logs
- [ ] Session tokens are secure
- [ ] API keys are not exposed in client

---

## Testing Checklist Summary

After completing all tests:

- [ ] All critical features work correctly
- [ ] No blocking bugs found
- [ ] Performance is acceptable
- [ ] Security checks pass
- [ ] Accessibility requirements met
- [ ] Browser compatibility confirmed
- [ ] Edge cases handled appropriately

---

## Notes

- Document any bugs found during testing
- Include steps to reproduce issues
- Note browser/device where issue occurs
- Include screenshots for visual bugs
- Prioritize bugs: Critical, High, Medium, Low
