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
    <div className="space-y-4 md:space-y-6 max-w-full overflow-x-hidden">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Cover Letters
          </h1>
          <p className="text-sm md:text-base text-muted-foreground truncate">View and copy your job-specific cover letters</p>
        </div>
      </div>

      <Card className="border-primary/20 shadow-lg max-w-full overflow-hidden">
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-lg md:text-xl">Your Cover Letters</CardTitle>
          <CardDescription className="text-sm">
            Click the copy button to easily paste your cover letters into applications
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
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
              <div className="md:hidden space-y-3">
                {coverLetters.map((letter) => (
                  <Card key={letter.id} className="border-border overflow-hidden">
                    <CardContent className="p-3 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-foreground truncate">
                            {Array.isArray(letter.job_recommendations) 
                              ? letter.job_recommendations[0]?.company_name || 'N/A'
                              : letter.job_recommendations?.company_name || 'N/A'}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 break-words">
                            {Array.isArray(letter.job_recommendations) 
                              ? letter.job_recommendations[0]?.job_description || 'N/A'
                              : letter.job_recommendations?.job_description || 'N/A'}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(letter.cover_letter_text, letter.id)}
                          className="flex-shrink-0 h-8 w-8"
                        >
                          {copiedId === letter.id ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="text-xs text-muted-foreground line-clamp-3 break-words bg-muted/50 p-2 rounded-md overflow-hidden">
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
