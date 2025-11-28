import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { CheckSquare, Calendar, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface JobRecommendation {
  id: string;
  company_name: string;
  job_description: string;
  ats_score: number;
  apply_link: string;
  created_at: string;
  applied?: boolean;
}

const AppliedJobRecommendations = () => {
  const [jobs, setJobs] = useState<JobRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();

    const channel = supabase
      .channel('applied-jobs-changes')
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
        .order('created_at', { ascending: false });

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

  const handleToggleApplied = async (jobId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('job_recommendations')
        .update({ applied: currentStatus })
        .eq('id', jobId);

      if (error) throw error;

      // Update local state optimistically
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, applied: currentStatus } : job
      ));

      toast({
        title: currentStatus ? "Marked as Applied" : "Marked as Not Applied",
        description: "Job application status updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Applied Job Recommendations
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Track your job applications and their status
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          Loading applications...
        </p>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-sm text-muted-foreground text-center">
              No job recommendations yet. Upload your resume to start receiving daily job recommendations.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <Card className="hidden md:block">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-primary" />
                Application Tracker
              </CardTitle>
              <CardDescription>
                Toggle to mark jobs as applied
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Applied</TableHead>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Job Description</TableHead>
                    <TableHead className="text-center">Date</TableHead>
                    <TableHead className="text-center">ATS Score</TableHead>
                    <TableHead className="text-center">Apply</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <Switch
                          checked={job.applied || false}
                          onCheckedChange={(checked) => handleToggleApplied(job.id, checked)}
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                        />
                      </TableCell>
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
                                  {description.slice(0, 3).map((item, index) => (
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
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(job.created_at), 'MMM dd, yyyy')}
                        </div>
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
            </CardContent>
          </Card>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{job.company_name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(job.created_at), 'MMM dd, yyyy')}
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          job.ats_score >= 90 ? 'bg-green-100 text-green-800' :
                          job.ats_score >= 80 ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {job.ats_score}%
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-muted-foreground">Applied</span>
                      <Switch
                        checked={job.applied || false}
                        onCheckedChange={(checked) => handleToggleApplied(job.id, checked)}
                        className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    {(() => {
                      try {
                        const description = typeof job.job_description === 'string' 
                          ? JSON.parse(job.job_description) 
                          : job.job_description;
                        
                        if (Array.isArray(description)) {
                          return (
                            <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
                              {description.slice(0, 3).map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          );
                        }
                        return <p className="text-sm text-muted-foreground">{description}</p>;
                      } catch {
                        return <p className="text-sm text-muted-foreground">{job.job_description}</p>;
                      }
                    })()}
                  </div>
                  <Button className="w-full" variant="outline" asChild>
                    <a href={job.apply_link} target="_blank" rel="noopener noreferrer">
                      Apply <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AppliedJobRecommendations;
