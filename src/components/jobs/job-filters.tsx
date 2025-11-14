'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Search, X, SlidersHorizontal, MapPin, Briefcase, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface JobFiltersProps {
  categories?: string[]
  locations?: string[]
  isMobile?: boolean
}

export function JobFilters({ categories = [], locations = [], isMobile = false }: JobFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get current filters from URL
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [location, setLocation] = useState(searchParams.get('location_city') || '')
  const [employmentTypes, setEmploymentTypes] = useState<string[]>(
    searchParams.get('employment_type')?.split(',').filter(Boolean) || []
  )
  const [isRemote, setIsRemote] = useState(searchParams.get('is_remote') === 'true')
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'latest')

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ search })
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  const updateFilters = (updates: Record<string, any>) => {
    const params = new URLSearchParams(searchParams.toString())

    // Update or remove parameters
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== '' && value !== false && (!Array.isArray(value) || value.length > 0)) {
        if (Array.isArray(value)) {
          params.set(key, value.join(','))
        } else {
          params.set(key, String(value))
        }
      } else {
        params.delete(key)
      }
    })

    // Reset to page 1 when filters change
    params.set('page', '1')

    router.push(`?${params.toString()}`, { scroll: false })
  }

  const handleCategoryChange = (value: string) => {
    const newCategory = value === 'all' ? '' : value
    setCategory(newCategory)
    updateFilters({ category: newCategory })
  }

  const handleLocationChange = (value: string) => {
    const newLocation = value === 'all' ? '' : value
    setLocation(newLocation)
    updateFilters({ location_city: newLocation })
  }

  const handleEmploymentTypeToggle = (type: string) => {
    const newTypes = employmentTypes.includes(type)
      ? employmentTypes.filter((t) => t !== type)
      : [...employmentTypes, type]
    setEmploymentTypes(newTypes)
    updateFilters({ employment_type: newTypes.length > 0 ? newTypes.join(',') : '' })
  }

  const handleRemoteToggle = () => {
    const newRemote = !isRemote
    setIsRemote(newRemote)
    updateFilters({ is_remote: newRemote ? 'true' : '' })
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    updateFilters({ sort_by: value })
  }

  const clearAllFilters = () => {
    setSearch('')
    setCategory('')
    setLocation('')
    setEmploymentTypes([])
    setIsRemote(false)
    setSortBy('latest')
    router.push('/dashboard/candidate/jobs')
  }

  // Count active filters
  const activeFiltersCount =
    (search ? 1 : 0) +
    (category ? 1 : 0) +
    (location ? 1 : 0) +
    employmentTypes.length +
    (isRemote ? 1 : 0)

  const employmentTypeOptions = [
    { value: 'fulltime', label: 'Full Time' },
    { value: 'parttime', label: 'Part Time' },
    { value: 'internship', label: 'Internship' },
    { value: 'contract', label: 'Contract' },
  ]

  const sortOptions = [
    { value: 'latest', label: 'Terbaru' },
    { value: 'salary_high', label: 'Gaji Tertinggi' },
    { value: 'salary_low', label: 'Gaji Terendah' },
    { value: 'deadline', label: 'Deadline' },
  ]

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="space-y-2">
        <Label htmlFor="search">Cari Pekerjaan</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Cari posisi, perusahaan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <Select value={category || 'all'} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Location Filter */}
      {locations.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="location">Lokasi</Label>
          <Select value={location || 'all'} onValueChange={handleLocationChange}>
            <SelectTrigger id="location">
              <SelectValue placeholder="Semua Lokasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Lokasi</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    {loc}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Employment Type Filter */}
      <div className="space-y-3">
        <Label>Tipe Pekerjaan</Label>
        <div className="space-y-2">
          {employmentTypeOptions.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <Checkbox
                id={type.value}
                checked={employmentTypes.includes(type.value)}
                onCheckedChange={() => handleEmploymentTypeToggle(type.value)}
              />
              <label
                htmlFor={type.value}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Remote Toggle */}
      <div className="space-y-3">
        <Label>Remote Work</Label>
        <div className="flex items-center space-x-2">
          <Checkbox id="remote" checked={isRemote} onCheckedChange={handleRemoteToggle} />
          <label
            htmlFor="remote"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Hanya pekerjaan remote
          </label>
        </div>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <Label htmlFor="sort">Urutkan</Label>
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger id="sort">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearAllFilters}>
          <X className="h-4 w-4 mr-2" />
          Hapus Semua Filter ({activeFiltersCount})
        </Button>
      )}
    </div>
  )

  // Mobile: Sheet
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="relative">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filter
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center" variant="default">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Lowongan
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FiltersContent />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop: Card
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <SlidersHorizontal className="h-5 w-5" />
          Filter Lowongan
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="ml-auto">
              {activeFiltersCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FiltersContent />
      </CardContent>
    </Card>
  )
}
