import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DocumentPreviewDialog } from "@/components/ui/document-preview-dialog";
import { ProfileHeader } from "@/components/candidate/profile-header";
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  MapPin,
  Phone,
  Calendar,
  Building,
  Download,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function CandidateProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "candidate") {
    redirect("/dashboard");
  }

  // Get candidate profile
  const { data: candidateProfile } = await supabase
    .from("candidate_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Get candidate experiences
  const { data: experiences } = await supabase
    .from("candidate_experiences")
    .select("*")
    .eq("candidate_id", user.id)
    .order("start_date", { ascending: false });

  // Get candidate certificates
  const { data: certificates } = await supabase
    .from("candidate_certificates")
    .select("*")
    .eq("candidate_id", user.id)
    .order("created_at", { ascending: false });

  // Calculate profile completeness
  const completenessFields = [
    {
      label: "Data Pribadi",
      value:
        candidateProfile?.nik &&
        candidateProfile?.full_name &&
        candidateProfile?.birth_date,
    },
    {
      label: "Pendidikan",
      value: candidateProfile?.education_level && candidateProfile?.institution,
    },
    {
      label: "Keahlian",
      value: candidateProfile?.skills && candidateProfile.skills.length > 0,
    },
    {
      label: "Dokumen",
      value: candidateProfile?.cv_url || candidateProfile?.diploma_url,
    },
  ];
  const completedFields = completenessFields.filter((f) => f.value).length;
  const completenessPercentage =
    (completedFields / completenessFields.length) * 100;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Profil Saya</h1>
        <p className="mt-2 text-muted-foreground">
          Kelola informasi profil dan CV Anda
        </p>
      </div>

      {/* Profile Completeness Alert */}
      {completenessPercentage < 100 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900">
                  Profil Belum Lengkap ({Math.round(completenessPercentage)}%)
                </h3>
                <p className="text-sm text-orange-700 mt-1">
                  Lengkapi profil Anda untuk meningkatkan peluang diterima kerja
                </p>
                <div className="mt-3 space-y-1">
                  {completenessFields.map((field, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      {field.value ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-orange-300" />
                      )}
                      <span
                        className={
                          field.value ? "text-green-900" : "text-orange-700"
                        }
                      >
                        {field.label}
                      </span>
                    </div>
                  ))}
                </div>
                <Button asChild size="sm" className="mt-4">
                  <Link href="/dashboard/candidate/profile/edit">
                    Lengkapi Sekarang
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!candidateProfile ? (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Profil Belum Dibuat</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Anda belum melengkapi profil kandidat
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/candidate/profile/edit">
                Lengkapi Profil
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Profile Photo & Header - Modern Design */}
          <ProfileHeader
            user={{ id: user.id, email: user.email! }}
            profile={profile}
            candidateProfile={candidateProfile}
          />

          {/* Data Pribadi */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Data Pribadi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <DataField
                  label="NIK"
                  value={candidateProfile.nik}
                  icon={<FileText className="h-4 w-4" />}
                />
                <DataField
                  label="Nama Lengkap"
                  value={candidateProfile.full_name}
                  icon={<User className="h-4 w-4" />}
                />
                <DataField
                  label="Tempat Lahir"
                  value={candidateProfile.birth_place}
                  icon={<MapPin className="h-4 w-4" />}
                />
                <DataField
                  label="Tanggal Lahir"
                  value={
                    candidateProfile.birth_date
                      ? new Date(
                          candidateProfile.birth_date
                        ).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : null
                  }
                  icon={<Calendar className="h-4 w-4" />}
                />
                <DataField
                  label="Jenis Kelamin"
                  value={
                    candidateProfile.gender === "male"
                      ? "Laki-laki"
                      : candidateProfile.gender === "female"
                      ? "Perempuan"
                      : null
                  }
                  icon={<User className="h-4 w-4" />}
                />
                <DataField
                  label="Nomor Telepon"
                  value={candidateProfile.phone}
                  icon={<Phone className="h-4 w-4" />}
                />
                <div className="md:col-span-2">
                  <DataField
                    label="Alamat"
                    value={candidateProfile.address}
                    icon={<MapPin className="h-4 w-4" />}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pendidikan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Pendidikan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <DataField
                  label="Jenjang Pendidikan"
                  value={
                    candidateProfile.education_level
                      ? candidateProfile.education_level.toUpperCase()
                      : null
                  }
                  icon={<GraduationCap className="h-4 w-4" />}
                />
                <DataField
                  label="Institusi"
                  value={candidateProfile.institution}
                  icon={<Building className="h-4 w-4" />}
                />
                <DataField
                  label="Jurusan"
                  value={candidateProfile.major}
                  icon={<FileText className="h-4 w-4" />}
                />
                <DataField
                  label="Tahun Lulus"
                  value={candidateProfile.graduation_year?.toString()}
                  icon={<Calendar className="h-4 w-4" />}
                />
                {candidateProfile.gpa && (
                  <DataField
                    label="IPK"
                    value={candidateProfile.gpa.toString()}
                    icon={<Award className="h-4 w-4" />}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pengalaman Kerja */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Pengalaman Kerja
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!experiences || experiences.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">Belum ada pengalaman kerja</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {experiences.map((exp, index) => (
                    <div key={exp.id}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{exp.position}</h4>
                            <p className="text-sm text-muted-foreground">
                              {exp.company_name}
                            </p>
                          </div>
                          {exp.is_current && (
                            <Badge variant="secondary">Saat Ini</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(exp.start_date).toLocaleDateString(
                              "id-ID",
                              {
                                month: "short",
                                year: "numeric",
                              }
                            )}{" "}
                            -{" "}
                            {exp.is_current
                              ? "Sekarang"
                              : exp.end_date
                              ? new Date(exp.end_date).toLocaleDateString(
                                  "id-ID",
                                  {
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "Sekarang"}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills & Keahlian */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Skills & Keahlian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Skills */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Skills</h4>
                  {!candidateProfile.skills ||
                  candidateProfile.skills.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Belum ada skills ditambahkan
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {candidateProfile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* JLPT Level */}
                {candidateProfile.jlpt_level && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium mb-2">JLPT Level</h4>
                      <Badge variant="outline">
                        {candidateProfile.jlpt_level.toUpperCase()}
                      </Badge>
                    </div>
                  </>
                )}

                {/* Portfolio Link */}
                {candidateProfile.portfolio_url && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium mb-2">Portfolio</h4>
                      <a
                        href={candidateProfile.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Lihat Portfolio
                      </a>
                    </div>
                  </>
                )}

                {/* Certificates */}
                {certificates && certificates.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium mb-3">Sertifikat</h4>
                      <div className="space-y-3">
                        {certificates.map((cert) => (
                          <div
                            key={cert.id}
                            className="border rounded-lg p-4 bg-muted/30"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h5 className="font-semibold text-sm">
                                  {cert.name}
                                </h5>
                                {cert.issuer && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Penerbit: {cert.issuer}
                                  </p>
                                )}
                                {cert.description && (
                                  <p className="text-sm text-muted-foreground mt-2">
                                    {cert.description}
                                  </p>
                                )}
                              </div>
                              {cert.file_url && (
                                <a
                                  href={cert.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-shrink-0"
                                >
                                  <Button variant="outline" size="sm">
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Lihat
                                  </Button>
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dokumen */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Dokumen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <DocumentField
                  label="CV / Resume"
                  url={candidateProfile.cv_url}
                />
                <DocumentField label="KTP" url={candidateProfile.ktp_url} />
                <DocumentField
                  label="Ijazah"
                  url={candidateProfile.diploma_url}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Helper Components
function DataField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | null | undefined;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <p className="text-sm">
          {value || (
            <span className="text-muted-foreground italic">Belum diisi</span>
          )}
        </p>
      </div>
    </div>
  );
}

function DocumentField({
  label,
  url,
}: {
  label: string;
  url: string | null | undefined;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      {url ? (
        <DocumentPreviewDialog url={url} label={label}>
          <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Lihat {label}</p>
              <p className="text-xs text-muted-foreground">Klik untuk preview</p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </DocumentPreviewDialog>
      ) : (
        <div className="flex items-center gap-2 p-3 border border-dashed rounded-lg bg-muted/20">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground italic">Belum diunggah</p>
        </div>
      )}
    </div>
  );
}
