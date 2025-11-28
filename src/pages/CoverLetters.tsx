import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast";

interface CoverLetter {
  id: string;
  job_recommendation_id: string;
  cover_letter_text: string;
  created_at: string;
  job_recommendations?: {
    company_name: string;
    job_description: string;
  } | {
    company_name: string;
    job_description: string;
  }[];
}

const CoverLetters = () => {
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchCoverLetters();

    const channel = supabase
      .channel('cover-letters-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cover_letters'
        },
        () => {
          fetchCoverLetters();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCoverLetters = async () => {
    try {
      const { data, error } = await supabase
        .from('cover_letters')
        .select(`
          *,
          job_recommendations (
            company_name,
            job_description
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoverLetters(data || []);
    } catch (error: any) {
      toast.error(error.message || "Error fetching cover letters");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      // Replace escape sequences with actual formatting
      const formattedText = text
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '  ');
      await navigator.clipboard.writeText(formattedText);
      setCopiedId(id);
      toast.success("Cover letter copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Cover Letters
          </h1>
          <p className="text-muted-foreground">View and copy your job-specific cover letters</p>
        </div>
      </div>

      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle>Your Cover Letters</CardTitle>
          <CardDescription>
            Click the copy button to easily paste your cover letters into applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : coverLetters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No cover letters yet</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Job</TableHead>
                      <TableHead className="w-[50%]">Cover Letter</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coverLetters.map((letter) => (
                      <TableRow key={letter.id}>
                        <TableCell className="font-medium">
                          {Array.isArray(letter.job_recommendations) 
                            ? letter.job_recommendations[0]?.company_name || 'N/A'
                            : letter.job_recommendations?.company_name || 'N/A'}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {Array.isArray(letter.job_recommendations) 
                            ? letter.job_recommendations[0]?.job_description || 'N/A'
                            : letter.job_recommendations?.job_description || 'N/A'}
                        </TableCell>
                        <TableCell className="max-w-[400px]">
                          <div className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">
                            {letter.cover_letter_text.replace(/\\n/g, '\n').replace(/\\t/g, '  ')}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(letter.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(letter.cover_letter_text, letter.id)}
                            className="gap-2"
                          >
                            {copiedId === letter.id ? (
                              <>
                                <Check className="w-4 h-4" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copy
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {coverLetters.map((letter) => (
                  <Card key={letter.id} className="border-border">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">
                            {Array.isArray(letter.job_recommendations) 
                              ? letter.job_recommendations[0]?.company_name || 'N/A'
                              : letter.job_recommendations?.company_name || 'N/A'}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {Array.isArray(letter.job_recommendations) 
                              ? letter.job_recommendations[0]?.job_description || 'N/A'
                              : letter.job_recommendations?.job_description || 'N/A'}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(letter.cover_letter_text, letter.id)}
                          className="gap-2 flex-shrink-0"
                        >
                          {copiedId === letter.id ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span className="sr-only">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span className="sr-only">Copy</span>
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
                        {letter.cover_letter_text.replace(/\\n/g, '\n').replace(/\\t/g, '  ')}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {new Date(letter.created_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoverLetters;
