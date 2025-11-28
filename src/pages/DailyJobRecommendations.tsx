import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

const DailyJobRecommendations = () => {
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
          <p className="text-sm text-muted-foreground text-center py-8">
            Upload your resume to start receiving daily job recommendations
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyJobRecommendations;
