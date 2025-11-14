"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Edit,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
} from "lucide-react";
import { ProfilePhotoModal } from "./profile-photo-modal";

interface ProfileHeaderProps {
  user: {
    id: string;
    email: string;
  };
  profile: {
    avatar_url?: string | null;
  };
  candidateProfile: {
    full_name?: string;
    phone?: string;
    address?: string;
    education_level?: string;
    institution?: string;
    linkedin_url?: string;
    instagram_url?: string;
    facebook_url?: string;
    twitter_url?: string;
  };
}

export function ProfileHeader({
  user,
  profile,
  candidateProfile,
}: ProfileHeaderProps) {
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(profile?.avatar_url);

  const handlePhotoUpdated = (newUrl: string) => {
    setCurrentAvatarUrl(newUrl);
  };

  // Add cache-busting parameter to avatar URL to prevent browser caching
  const getAvatarUrlWithCacheBusting = (url: string | null | undefined) => {
    if (!url) return null;
    // If URL already has timestamp parameter, use as is
    if (url.includes("?t=")) return url;
    // Add timestamp parameter to bust cache
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}t=${Date.now()}`;
  };

  return (
    <Card className="overflow-hidden">
      {/* Banner with pattern */}
      <div className="h-40 bg-gradient-to-br from-primary via-primary/80 to-primary/60 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6TTEyIDM0YzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00em0wLTIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00em0yNCAwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00em0wIDIwYzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00ek0xMiA1NGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNHptMjQgMGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      </div>
      <CardContent className="relative pt-0 pb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          {/* Profile Photo with Edit Button */}
          <div className="relative -mt-20 flex-shrink-0">
            <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-background shadow-xl bg-muted">
              {currentAvatarUrl ? (
                <img
                  src={
                    getAvatarUrlWithCacheBusting(currentAvatarUrl) ||
                    currentAvatarUrl
                  }
                  alt={candidateProfile.full_name || "Profile"}
                  className="w-full h-full object-cover"
                  key={currentAvatarUrl} // Force re-render when URL changes
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center">
                  <User className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </div>
            {/* Camera Button with Modal */}
            <ProfilePhotoModal
              userId={user.id}
              currentPhotoUrl={currentAvatarUrl}
              onPhotoUpdated={handlePhotoUpdated}
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1 md:pb-2">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  {candidateProfile.full_name || "Nama Belum Diisi"}
                </h2>
                {candidateProfile.education_level &&
                  candidateProfile.institution && (
                    <p className="text-muted-foreground mt-1">
                      {candidateProfile.education_level.toUpperCase()} •{" "}
                      {candidateProfile.institution}
                    </p>
                  )}
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/candidate/profile/edit">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profil
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Email */}
              {user.email && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="text-sm">{user.email}</span>
                </div>
              )}

              {/* Phone */}
              {candidateProfile.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span className="text-sm">{candidateProfile.phone}</span>
                </div>
              )}

              {/* Address */}
              {candidateProfile.address && (
                <div className="flex items-center gap-2 text-muted-foreground md:col-span-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="text-sm">{candidateProfile.address}</span>
                </div>
              )}
            </div>

            {/* Social Media Links */}
            {(candidateProfile.linkedin_url ||
              candidateProfile.instagram_url ||
              candidateProfile.facebook_url ||
              candidateProfile.twitter_url) && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-muted-foreground mr-2">
                  Connect:
                </span>
                {candidateProfile.linkedin_url && (
                  <a
                    href={candidateProfile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                    title="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {candidateProfile.instagram_url && (
                  <a
                    href={candidateProfile.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                    title="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {candidateProfile.facebook_url && (
                  <a
                    href={candidateProfile.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                    title="Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
                {candidateProfile.twitter_url && (
                  <a
                    href={candidateProfile.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                    title="Twitter"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
