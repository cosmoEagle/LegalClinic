// 'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeamMember {
  name: string;
  role: string;
  image: string;
//   bio: string;
  social: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: 'Amartya Saran',
    role: 'Team Lead',
    image: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=800',
    // bio: 'With over 8 years of experience in legal tech, Sarah leads our platform development ensuring seamless integration of legal expertise with cutting-edge technology.',
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      email: 'sarah@legalclinic.com'
    }
  },
  {
    name: 'Shreesh Shukla',
    role: 'Developer',
    image: 'https://images.pexels.com/photos/3776932/pexels-photo-3776932.jpeg?auto=compress&cs=tinysrgb&w=800',
    // bio: 'Michael brings 12 years of legal practice experience, specializing in property law and civil litigation. He oversees our document drafting services.',
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      email: 'michael@legalclinic.com'
    }
  },
  {
    name: 'Dishant Soam',
    role: 'Developer',
    image: 'https://images.pexels.com/photos/5792641/pexels-photo-5792641.jpeg?auto=compress&cs=tinysrgb&w=800',
    // bio: 'Priya combines her legal background with AI expertise to develop and maintain our intelligent legal assistance systems.',
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      email: 'priya@legalclinic.com'
    }
  },
  {
    name: 'Shwet Gupta',
    role: 'Developer',
    image: 'https://images.pexels.com/photos/5792641/pexels-photo-5792641.jpeg?auto=compress&cs=tinysrgb&w=800',
    // bio: 'James ensures our platform provides accurate, up-to-date legal information and oversees the quality of our automated responses.',
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      email: 'james@legalclinic.com'
    }
  }
];

export const metadata = {
  title: 'About Us - LegalClinic',
  description: 'Meet our team of legal technology experts dedicated to making legal assistance accessible to everyone.',
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Meet Our Team <b>Techvocates</b>
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          We're a dedicated team of legal and technology professionals working to make legal assistance more accessible and efficient.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {teamMembers.map((member) => (
          <Card key={member.name} className="overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-1/3 h-64 sm:h-auto">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col justify-between w-full">
                <div>
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
                  {/* <p className="text-sm text-gray-700">{member.bio}</p> */}
                </div>
                <div className="flex gap-3 mt-4">
                  {member.social.github && (
                    <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon">
                        <Github className="h-5 w-5" />
                      </Button>
                    </a>
                  )}
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon">
                        <Linkedin className="h-5 w-5" />
                      </Button>
                    </a>
                  )}
                  {member.social.email && (
                    <a href={`mailto:${member.social.email}`}>
                      <Button variant="ghost" size="icon">
                        <Mail className="h-5 w-5" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
