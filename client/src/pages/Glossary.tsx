import React from "react";
import Glossary from "../components/Glossary";

const GlossaryPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Glossary</h1>
      <Glossary />
    </div>
  );
};

export default GlossaryPage;
