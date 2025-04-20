'use client';

import { useState } from 'react';
import { Gavel, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

// Acts data
const acts = {
  "Select an Act": null,
  "THE BHARATIYA NYAYA SANHITA, 2023": "THE BHARATIYA NYAYA SANHITA, 2023",
  "THE BHARATIYA NAGARIK SURAKSHA SANHITA, 2023": "THE BHARATIYA NAGARIK SURAKSHA SANHITA, 2023", 
  "THE CODE OF CRIMINAL PROCEDURE, 1973": "THE CODE OF CRIMINAL PROCEDURE, 1973",
  "THE PROTECTION OF WOMEN FROM DOMESTIC VIOLENCE ACT, 2005": "THE PROTECTION OF WOMEN FROM DOMESTIC VIOLENCE ACT, 2005",
  "THE INDIAN PENAL CODE": "THE INDIAN PENAL CODE",
  "THE INDECENT REPRESENTATION OF WOMEN (PROHIBITION) ACT, 1986": "THE INDECENT REPRESENTATION OF WOMEN (PROHIBITION) ACT, 1986",
  "THE IMMORAL TRAFFIC (PREVENTION) ACT, 1956": "THE IMMORAL TRAFFIC (PREVENTION) ACT, 1956",
  "THE INFORMATION TECHNOLOGY ACT, 2000": "THE INFORMATION TECHNOLOGY ACT, 2000",
  "THE JUVENILE JUSTICE (CARE AND PROTECTION OF CHILDREN) ACT, 2015": "THE JUVENILE JUSTICE (CARE AND PROTECTION OF CHILDREN) ACT, 2015",
  "THE NATIONAL INVESTIGATION AGENCY ACT, 2008": "THE NATIONAL INVESTIGATION AGENCY ACT, 2008",
  "THE NATIONAL SECURITY ACT, 1980": "THE NATIONAL SECURITY ACT, 1980",
  "THE PREVENTION OF CORRUPTION ACT, 1988": "THE PREVENTION OF CORRUPTION ACT, 1988",
  "THE PREVENTION OF MONEY-LAUNDERING ACT, 2002": "THE PREVENTION OF MONEY-LAUNDERING ACT, 2002",
  "THE PROTECTION OF CHILDREN FROM SEXUAL OFFENCES ACT, 2012": "THE PROTECTION OF CHILDREN FROM SEXUAL OFFENCES ACT, 2012",
  "THE SCHEDULED CASTES AND THE SCHEDULED TRIBES (PREVENTION OF ATROCITIES) ACT, 1989": "THE SCHEDULED CASTES AND THE SCHEDULED TRIBES (PREVENTION OF ATROCITIES) ACT, 1989",
  "THE UNLAWFUL ACTIVITIES (PREVENTION) ACT, 1967": "THE UNLAWFUL ACTIVITIES (PREVENTION) ACT, 1967"
};

export default function BailAdvisoryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    // Personal Information
    age: '',
    gender: 'Male',
    
    // Case Details
    incidentBrief: '',
    sectionsOffense: [] as string[],
    sections: '',
    
    // Bail Application History
    previousBail: 'No',
    bailOutcome: 'Allowed',
    allowedTerms: '',
    groundsRejection: '',
    courtName: '',
    
    // Criminal History
    otherCase: 'No',
    prevsectionsOffense: [] as string[],
    prevsections: '',
    
    // Health Information
    medicalCondition: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Format the data according to the API requirements
      const formattedData = {
        personal_information: {
          age: parseInt(formData.age),
          gender: formData.gender
        },
        case_details: {
          "Acts of Offence": formData.sectionsOffense.map(act => acts[act as keyof typeof acts]).filter(Boolean),
          "sections_of_offence": formData.sections,
          "Incident Brief": formData.incidentBrief
        },
        bail_application_history: {
          "Any previous bail application?": formData.previousBail,
          "Outcome": formData.bailOutcome,
          ...(formData.bailOutcome === 'Allowed' && { "Terms & Conditions": formData.allowedTerms }),
          ...(formData.bailOutcome === 'Not Allowed' && { "Grounds for Rejection": formData.groundsRejection }),
          "Court where the application was decided": formData.courtName
        },
        criminal_history: {
          "Any other previous case?": formData.otherCase,
          "Prev Acts of Offense": formData.prevsectionsOffense.map(act => acts[act as keyof typeof acts]).filter(Boolean),
          "Prev Section of Offence": formData.prevsections
        },
        health_information: {
          "Any medical condition?": formData.medicalCondition || "None"
        }
      };

      // Make API call to FastAPI backend
      const response = await fetch('http://localhost:5000/submit_bail_application/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error('Failed to get bail recommendation');
      }

      const result = await response.json();
      
      // Format the result for display
      let formattedResult = '';
      
      if (typeof result === 'string') {
        formattedResult = result;
      } else if (typeof result === 'object') {
        // Handle structured response
        formattedResult = `
          Bail Recommendation:
          
          ${result.recommendation || result.analysis || 'No specific recommendation available.'}
          
          ${result.conditions ? `
          Conditions:
          ${Array.isArray(result.conditions) 
            ? result.conditions.map((cond: string, i: number) => `${i + 1}. ${cond}`).join('\n')
            : result.conditions}
          ` : ''}
          
          ${result.risk_factors ? `
          Risk Factors:
          ${Array.isArray(result.risk_factors)
            ? result.risk_factors.map((factor: string, i: number) => `${i + 1}. ${factor}`).join('\n')
            : result.risk_factors}
          ` : ''}
          
          Note: This is an AI-generated recommendation and should not be considered as legal advice.
          Please consult with a qualified legal professional for actual legal guidance.
        `;
      }
      
      setResult(formattedResult);
    } catch (error) {
      console.error('Error processing bail recommendation:', error);
      setResult('An error occurred while processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen py-8">
      <div className="w-full max-w-5xl px-4">
        <div className="flex items-center gap-2 mb-6">
          <Gavel className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Bail Advisory</h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Fill out the form below to get a bail recommendation based on the provided information.
          This tool is designed to assist in understanding potential bail outcomes but should not replace legal counsel.
        </p>
        
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="case">Case Details</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Enter the personal details of the accused</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Enter age"
                        value={formData.age}
                        onChange={(e) => handleChange('age', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <RadioGroup
                        value={formData.gender}
                        onValueChange={(value) => handleChange('gender', value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Male" id="male" />
                          <Label htmlFor="male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Female" id="female" />
                          <Label htmlFor="female">Female</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="case">
              <Card>
                <CardHeader>
                  <CardTitle>Case Details</CardTitle>
                  <CardDescription>Provide information about the case</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="incidentBrief">Incident Brief</Label>
                    <Textarea
                      id="incidentBrief"
                      placeholder="Brief description of the incident"
                      value={formData.incidentBrief}
                      onChange={(e) => handleChange('incidentBrief', e.target.value)}
                      required
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Acts of Offense</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.keys(acts).map((act) => (
                        <div key={act} className="flex items-center space-x-2">
                          <Checkbox
                            id={act}
                            checked={formData.sectionsOffense.includes(act)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleChange('sectionsOffense', [...formData.sectionsOffense, act]);
                              } else {
                                handleChange(
                                  'sectionsOffense',
                                  formData.sectionsOffense.filter((item) => item !== act)
                                );
                              }
                            }}
                          />
                          <Label htmlFor={act} className="text-sm">{act}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sections">Sections of Offense</Label>
                    <Input
                      id="sections"
                      placeholder="Enter sections (comma-separated)"
                      value={formData.sections}
                      onChange={(e) => handleChange('sections', e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Bail & Criminal History</CardTitle>
                  <CardDescription>Information about previous bail applications and criminal history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Previous Bail Application</Label>
                      <RadioGroup
                        value={formData.previousBail}
                        onValueChange={(value) => handleChange('previousBail', value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Yes" id="prevBailYes" />
                          <Label htmlFor="prevBailYes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="No" id="prevBailNo" />
                          <Label htmlFor="prevBailNo">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {formData.previousBail === 'Yes' && (
                      <>
                        <div className="space-y-2">
                          <Label>Outcome</Label>
                          <RadioGroup
                            value={formData.bailOutcome}
                            onValueChange={(value) => handleChange('bailOutcome', value)}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Allowed" id="allowed" />
                              <Label htmlFor="allowed">Allowed</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Not Allowed" id="notAllowed" />
                              <Label htmlFor="notAllowed">Not Allowed</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        {formData.bailOutcome === 'Allowed' && (
                          <div className="space-y-2">
                            <Label htmlFor="allowedTerms">Terms & Conditions</Label>
                            <Textarea
                              id="allowedTerms"
                              placeholder="Enter terms and conditions"
                              value={formData.allowedTerms}
                              onChange={(e) => handleChange('allowedTerms', e.target.value)}
                              className="min-h-[100px]"
                            />
                          </div>
                        )}
                        
                        {formData.bailOutcome === 'Not Allowed' && (
                          <div className="space-y-2">
                            <Label htmlFor="groundsRejection">Grounds for Rejection</Label>
                            <Textarea
                              id="groundsRejection"
                              placeholder="Enter grounds for rejection"
                              value={formData.groundsRejection}
                              onChange={(e) => handleChange('groundsRejection', e.target.value)}
                              className="min-h-[100px]"
                            />
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <Label htmlFor="courtName">Court Name</Label>
                          <Input
                            id="courtName"
                            placeholder="Enter court name"
                            value={formData.courtName}
                            onChange={(e) => handleChange('courtName', e.target.value)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Other Previous Cases</Label>
                      <RadioGroup
                        value={formData.otherCase}
                        onValueChange={(value) => handleChange('otherCase', value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Yes" id="otherCaseYes" />
                          <Label htmlFor="otherCaseYes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="No" id="otherCaseNo" />
                          <Label htmlFor="otherCaseNo">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {formData.otherCase === 'Yes' && (
                      <>
                        <div className="space-y-2">
                          <Label>Previous Acts of Offense</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {Object.keys(acts).map((act) => (
                              <div key={`prev-${act}`} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`prev-${act}`}
                                  checked={formData.prevsectionsOffense.includes(act)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      handleChange('prevsectionsOffense', [...formData.prevsectionsOffense, act]);
                                    } else {
                                      handleChange(
                                        'prevsectionsOffense',
                                        formData.prevsectionsOffense.filter((item) => item !== act)
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor={`prev-${act}`} className="text-sm">{act}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="prevsections">Previous Sections of Offense</Label>
                          <Input
                            id="prevsections"
                            placeholder="Enter previous sections (comma-separated)"
                            value={formData.prevsections}
                            onChange={(e) => handleChange('prevsections', e.target.value)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="health">
              <Card>
                <CardHeader>
                  <CardTitle>Health Information</CardTitle>
                  <CardDescription>Medical conditions that may affect bail consideration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="medicalCondition">Medical Conditions</Label>
                    <Textarea
                      id="medicalCondition"
                      placeholder="Enter any medical conditions"
                      value={formData.medicalCondition}
                      onChange={(e) => handleChange('medicalCondition', e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 flex justify-center">
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Get Bail Recommendation'
              )}
            </Button>
          </div>
        </form>
        
        {result && (
          <div className="mt-8">
            <Alert>
              <AlertTitle>Bail Recommendation</AlertTitle>
              <AlertDescription className="whitespace-pre-line">
                {result}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
} 