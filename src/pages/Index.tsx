
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, FileUp, Layout } from 'lucide-react';

const Index = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  
  // Animate sections as they come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    const sections = document.querySelectorAll('.section-animate');
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 animate-fade-in">
            xAPI Learning Analytics Platform
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-slide-down">
            Unlock the Power of <span className="text-primary">Learning Data</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Upload, analyze, and visualize xAPI content with an elegant and intuitive interface. 
            Get powerful insights into learning experiences and make data-driven decisions.
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link to="/signup">
              <Button size="lg" className="btn-primary w-full sm:w-auto">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={scrollToFeatures}
              className="w-full sm:w-auto"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-6 md:px-10 bg-secondary/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 section-animate opacity-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides everything you need to manage and analyze xAPI learning content
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="content-card section-animate opacity-0" style={{ animationDelay: '0.1s' }}>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileUp className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Simple Content Upload</h3>
              <p className="text-muted-foreground">
                Effortlessly upload your xAPI content packages and make them available to your learners.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="content-card section-animate opacity-0" style={{ animationDelay: '0.2s' }}>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
              <p className="text-muted-foreground">
                Get comprehensive insights with beautiful visualizations of quiz performance and content completion.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="content-card section-animate opacity-0" style={{ animationDelay: '0.3s' }}>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Layout className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Intuitive Dashboard</h3>
              <p className="text-muted-foreground">
                Track progress and performance with a clean, easy-to-use dashboard designed for clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-10">
        <div className="max-w-5xl mx-auto text-center section-animate opacity-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Learning Analytics?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join our platform today and start gaining valuable insights from your xAPI learning content.
          </p>
          <Link to="/signup">
            <Button size="lg" className="btn-primary">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
