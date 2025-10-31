import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import RegistrationForm from './components/RegistrationForm';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import PaymentForm from './components/PaymentForm';
import SuccessPage from './components/SuccessPage';  // NEW: Success page
import PrivateAdminRoute from './components/admin/PrivateAdminRoute';
import AdminLogin from './components/admin/AdminLogin';
import Dashboard from './components/admin/Dashboard';
import StudentsList from './components/admin/StudentsList';
import MessagesList from './components/admin/MessagesList';
import SendEmail from './components/admin/SendEmail';
import About from './components/About';
import UserLogin from './components/UserLogin';
import MessagesUI from './components/message';
import UserDashboard from './components/UserDashboard';
import PrivateRoute from './components/PrivateRoute';
import UserNav from './components/UserNav';
import { UserContext } from './context/UserContext';
import { DashboardProvider } from "./context/DashboardContext";
import { AdminContext } from './context/AdminContext';
import AdminNav from './components/admin/AdminNav';
import AdminUserManagement from './components/admin/AdminUserManagement';


function App() {
  const {isLoggedIn} = useContext(UserContext);
  const {isAdminLoggedIn} = useContext(AdminContext);
  return (
    <Router>  {/* ✅ Router WRAPS EVERYTHING */}
      <div className="App">
       {isAdminLoggedIn ? (
        <AdminNav />
      ) : isLoggedIn ? (
        <UserNav />
      ) : (
        <Navbar />
      )}
        <Routes>  {/* ✅ ALL PAGES AS ROUTES */}
          {/* HOME - Landing Page */}
          <Route path="/" element={
            <>
              <HeroSection />
              <ServicesSection />
              <RegistrationForm />
              <About />
              <ContactForm />
            </>
          } />
          
          {/* STANDALONE PAYMENT */}
          <Route path="/payment" element={
            <section className="py-5 bg-light">
              <PaymentForm 
                userData={{ userId: 'temp', email: 'user@example.com', phone: '+237712345678' }} 
                onComplete={() => window.location.href = '/success'}  // ✅ Simple redirect
              />
            </section>
          } />
          {/* <Route path="/payment" element={<PaymentForm userData={{ userId: 'temp', email: 'user@example.com' }} onComplete={() => navigate('/success')} />} /> */}
          {/* SUCCESS PAGE */}
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/services" element={<ServicesSection />} />
           {/* onComplete={() => navigate('/success')} */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/register" element={<RegistrationForm />} /> {/*<RegistrationForm />*/}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/user/message" element={<MessagesUI />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/payment" element={<PrivateRoute><PaymentForm userData={{ userId: 'temp', email: 'user@example.com' }} /></PrivateRoute>} /> {/* onComplete={() => navigate('/success')} */}
          {/* <Route path="/user/dashboard" element={ <DashboardProvider>
          <UserNav />
          <UserDashboard />
          </DashboardProvider>
        }/> */}

          {/* Admin Routes */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<PrivateAdminRoute><Dashboard /></PrivateAdminRoute>} />
      <Route path="/admin/students" element={<PrivateAdminRoute><StudentsList /></PrivateAdminRoute>} />
      <Route path="/admin/messages" element={<PrivateAdminRoute><MessagesList /></PrivateAdminRoute>} />
      <Route path="/admin/send-email" element={<PrivateAdminRoute><SendEmail /></PrivateAdminRoute>} />
      <Route path="/admin/users" element={<PrivateAdminRoute><AdminUserManagement /></PrivateAdminRoute>} />

        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;






















// import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { BrowserRouter as Router, Routes, Route,useNavigate } from 'react-router-dom';
// import HeroSection from './components/HeroSection';
// import ServicesSection from './components/ServicesSection';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import RegistrationForm from './components/RegistrationForm';
// import ContactForm from './components/ContactForm';
// import PaymentForm from './components/PaymentForm';
// // import { useNavigate } from 'react-router-dom';



// function App() {
//   const navigate = useNavigate();
//   return (
//     <div className="App">
//       <Router>
//       <Routes>
//         <Route path="/" element={<><Navbar /><HeroSection />...</>} />
//         <Route path="/payment" element={
//           <section className="py-5 bg-light">
//             {/* <Container> */}
//               <PaymentForm userData={{ userId: 'temp', email: 'user@example.com' }} onComplete={() => navigate('/success')} />
//             {/* </Container> */}
//           </section>
//         } />
//       </Routes>
//     </Router>
//       <Navbar />
//       <HeroSection />
//       <ServicesSection />
//       <RegistrationForm />
//       <ContactForm />
//       <Footer />
//     </div>
//   );
// }

// export default App;