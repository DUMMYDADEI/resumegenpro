import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Briefcase, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface JobRecommendation {
  id: string;
  company_name: string;
  job_description: string;
  ats_score: number;
  apply_link: string;
  created_at: string;
}

const DailyJobRecommendations = () => {
  const [jobs, setJobs] = useState<JobRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();

    // Set up realtime subscription
    const channel = supabase
      .channel('job-recommendations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_recommendations'
        },
        () => {
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('job_recommendations')
        .select('*')
        .order('ats_score', { ascending: false })
        .limit(5);

      if (error) throw error;
      setJobs(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching jobs",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Daily Job Recommendations
        </h1>
        <p className="text-muted-foreground mt-2">
          Get 5 personalized job recommendations based on your resume
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Today's Recommendations
          </CardTitle>
          <CardDescription>
            Your personalized job matches for today
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Loading job recommendations...
            </p>
          ) : jobs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No job recommendations yet. Upload your resume to start receiving daily job recommendations.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Job Description</TableHead>
                  <TableHead className="text-center">ATS Score</TableHead>
                  <TableHead className="text-center">Apply</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.company_name}</TableCell>
                    <TableCell>
                      {(() => {
                        try {
                          const description = typeof job.job_description === 'string' 
                            ? JSON.parse(job.job_description) 
                            : job.job_description;
                          
                          if (Array.isArray(description)) {
                            return (
                              <ul className="list-disc list-inside space-y-1">
                                {description.map((item, index) => (
                                  <li key={index} className="text-sm">{item}</li>
                                ))}
                              </ul>
                            );
                          }
                          return description;
                        } catch {
                          return job.job_description;
                        }
                      })()}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.ats_score >= 90 ? 'bg-green-100 text-green-800' :
                        job.ats_score >= 80 ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {job.ats_score}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button size="sm" variant="outline" asChild>
                        <a href={job.apply_link} target="_blank" rel="noopener noreferrer">
                          Apply <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyJobRecommendations;
