import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './views/Home/Home';
import { Editor } from './views/Editor/Editor';
import { TemplateGallery } from './views/Templates/TemplateGallery';
import { Guide } from './views/Guide/Guide';
import { ColumnList } from './views/Column/ColumnList';
import { ArticleView } from './views/Column/ArticleView';
import { DownloadComplete } from './views/Download/DownloadComplete';
import { PrivacyPolicy } from './views/Privacy/PrivacyPolicy';
import { Contact } from './views/Contact/Contact';


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/templates" element={<TemplateGallery />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/column" element={<ColumnList />} />
        <Route path="/column/:id" element={<ArticleView />} />
        <Route path="/download/complete" element={<DownloadComplete />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
