import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";

const AppliedJobRecommendations = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Applied Job Recommendations
        </h1>
        <p className="text-muted-foreground mt-2">
          Track your job applications and their status
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-primary" />
            Application History
          </CardTitle>
          <CardDescription>
            View all jobs you've applied to
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No applications yet. Start applying to jobs to track them here!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppliedJobRecommendations;
