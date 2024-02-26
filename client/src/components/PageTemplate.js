import { motion } from "framer-motion";
import WaitingPage from "./WaitingPage";

const PageTemplate = ({ children }) => {

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-full min-h-screen will-change-transform bg-blanc z-50 origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 1.5, ease: [0.87, 0, 0.13, 1]}}
        >
        </motion.div>
        {children}
      <motion.div
        className="fixed top-0 left-0 w-full min-h-screen will-change-transform bg-blanc z-50 origin-bottom"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 1.5, ease: [0.87, 0, 0.13, 1]}}
      >
        </motion.div>
    </>
  );
};

export default PageTemplate;
