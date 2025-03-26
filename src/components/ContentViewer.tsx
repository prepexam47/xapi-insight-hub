
import React from 'react';
import { Button } from '@/components/ui/button';

interface ContentViewerProps {
  content: any;
  onQuizComplete: (contentId: string) => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ content, onQuizComplete }) => {
  if (!content) return null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden border rounded-md">
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Module Introduction</h2>
          <p className="mb-4">This is where the actual content from the xAPI package would be displayed. The content would typically include text, images, videos, and interactive elements.</p>
          <p className="mb-4">Users would navigate through the content and eventually reach the quiz section where they would be tested on the material.</p>
        </div>
        
        {/* Sample Quiz */}
        <div className="border p-6 rounded-md bg-gray-50">
          <h3 className="text-xl font-bold mb-4">Quiz</h3>
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="font-medium">1. What is the primary purpose of xAPI?</p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="radio" id="q1a" name="q1" className="mr-2" />
                  <label htmlFor="q1a">To create visual presentations</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" id="q1b" name="q1" className="mr-2" />
                  <label htmlFor="q1b">To track learning experiences</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" id="q1c" name="q1" className="mr-2" />
                  <label htmlFor="q1c">To design user interfaces</label>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="font-medium">2. What does a statement in xAPI consist of?</p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="radio" id="q2a" name="q2" className="mr-2" />
                  <label htmlFor="q2a">Actor, verb, object</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" id="q2b" name="q2" className="mr-2" />
                  <label htmlFor="q2b">Subject, predicate, object</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" id="q2c" name="q2" className="mr-2" />
                  <label htmlFor="q2c">User, action, result</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t flex justify-end bg-gray-50">
        <Button onClick={() => onQuizComplete(content.$id)}>
          Submit Quiz & Generate Report
        </Button>
      </div>
    </div>
  );
};

export default ContentViewer;
