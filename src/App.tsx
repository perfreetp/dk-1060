import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { OnboardingPage } from "./pages/OnboardingPage";
import { KnowledgeMapPage } from "./pages/KnowledgeMapPage";
import { EntryDetailPage } from "./pages/EntryDetailPage";
import { QAPage } from "./pages/QAPage";
import { LearningProgressPage } from "./pages/LearningProgressPage";
import { AdminPage } from "./pages/AdminPage";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<OnboardingPage />} />
          <Route path="/knowledge-map" element={<KnowledgeMapPage />} />
          <Route path="/entry/:id" element={<EntryDetailPage />} />
          <Route path="/qa" element={<QAPage />} />
          <Route path="/learning-progress" element={<LearningProgressPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
