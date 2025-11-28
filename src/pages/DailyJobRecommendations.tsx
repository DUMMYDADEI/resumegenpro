import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Briefcase, ExternalLink } from "lucide-react";

const mockJobs = [
  {
    id: 1,
    companyName: "Tech Corp",
    jobDescription: "Senior Software Engineer - Full Stack Development with React and Node.js",
    atsScore: 95,
    applyLink: "https://example.com/job1"
  },
  {
    id: 2,
    companyName: "Innovation Labs",
    jobDescription: "Frontend Developer - Building modern web applications with TypeScript",
    atsScore: 88,
    applyLink: "https://example.com/job2"
  },
  {
    id: 3,
    companyName: "Data Systems Inc",
    jobDescription: "Backend Engineer - Microservices architecture and cloud infrastructure",
    atsScore: 82,
    applyLink: "https://example.com/job3"
  },
  {
    id: 4,
    companyName: "Creative Studios",
    jobDescription: "Full Stack Developer - React, Node.js, and AWS experience required",
    atsScore: 79,
    applyLink: "https://example.com/job4"
  },
  {
    id: 5,
    companyName: "Global Solutions",
    jobDescription: "Software Engineer - Working on cutting-edge AI and ML projects",
    atsScore: 75,
    applyLink: "https://example.com/job5"
  }
];

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
              {mockJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.companyName}</TableCell>
                  <TableCell>{job.jobDescription}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.atsScore >= 90 ? 'bg-green-100 text-green-800' :
                      job.atsScore >= 80 ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {job.atsScore}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button size="sm" variant="outline" asChild>
                      <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
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
    </div>
  );
};

export default DailyJobRecommendations;
