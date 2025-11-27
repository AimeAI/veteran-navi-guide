import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  TrendingUp,
  Briefcase,
  Award,
  DollarSign,
  Target,
  ArrowRight,
  Shield,
  CheckCircle2
} from 'lucide-react';
import { militaryTrades, searchTrades, type MilitaryTrade, type CivilianRole } from '@/data/militaryToCivilianMapping';

export default function MilitaryTranslatorPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<MilitaryTrade | null>(null);
  const [filteredTrades, setFilteredTrades] = useState<MilitaryTrade[]>([]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const results = searchTrades(searchTerm);
      setFilteredTrades(results);
      if (results.length === 1) {
        setSelectedTrade(results[0]);
      }
    } else {
      setFilteredTrades([]);
    }
  };

  const handleTradeSelect = (trade: MilitaryTrade) => {
    setSelectedTrade(trade);
    setSearchTerm('');
    setFilteredTrades([]);
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const branches = ['All', 'Army', 'Navy', 'Air Force'];
  const [selectedBranch, setSelectedBranch] = useState('All');

  const displayTrades = filteredTrades.length > 0
    ? filteredTrades
    : militaryTrades.filter(t => selectedBranch === 'All' || t.branch === selectedBranch);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Military-to-Civilian Job Translator</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Discover which civilian careers match your military experience
        </p>
        <div className="flex gap-4 flex-wrap">
          <Badge variant="secondary" className="gap-1">
            <Shield className="h-4 w-4" />
            {militaryTrades.length} Military Trades
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Briefcase className="h-4 w-4" />
            Personalized Career Paths
          </Badge>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your military trade (e.g., Infantry, Supply Tech, Pilot)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9"
              />
            </div>
            <Button onClick={handleSearch}>
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Trade Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Select Your Trade</CardTitle>
              <CardDescription>Choose your military occupation</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Branch Tabs */}
              <Tabs value={selectedBranch} onValueChange={setSelectedBranch} className="mb-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="All">All</TabsTrigger>
                  <TabsTrigger value="Army">Army</TabsTrigger>
                </TabsList>
                <TabsList className="grid w-full grid-cols-2 mt-2">
                  <TabsTrigger value="Navy">Navy</TabsTrigger>
                  <TabsTrigger value="Air Force">Air Force</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Trade List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {displayTrades.map((trade) => (
                  <Button
                    key={trade.id}
                    variant={selectedTrade?.id === trade.id ? 'default' : 'outline'}
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => handleTradeSelect(trade)}
                  >
                    <div>
                      <div className="font-semibold">{trade.name}</div>
                      <div className="text-xs opacity-70">{trade.branch}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Trade Details & Civilian Roles */}
        <div className="lg:col-span-2">
          {selectedTrade ? (
            <div className="space-y-6">
              {/* Trade Overview */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedTrade.name}</CardTitle>
                      <CardDescription>{selectedTrade.description}</CardDescription>
                    </div>
                    <Badge>{selectedTrade.branch}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Your Transferable Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrade.transferableSkills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {selectedTrade.certifications && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Recommended Certifications
                      </h3>
                      <ul className="space-y-1">
                        {selectedTrade.certifications.map((cert, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            • {cert}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Civilian Career Matches */}
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Target className="h-6 w-6" />
                  Your Best Civilian Career Matches
                </h2>
                <div className="grid gap-4">
                  {selectedTrade.civilianRoles
                    .sort((a, b) => b.matchPercentage - a.matchPercentage)
                    .map((role: CivilianRole, idx: number) => (
                      <Card key={idx} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <CardTitle className="text-xl">{role.title}</CardTitle>
                              <CardDescription className="flex gap-2 items-center mt-1">
                                <Briefcase className="h-4 w-4" />
                                {role.industry.join(', ')}
                              </CardDescription>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge className={getMatchColor(role.matchPercentage)}>
                                {role.matchPercentage}% Match
                              </Badge>
                              {role.inDemand && (
                                <Badge variant="default" className="gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  In Demand
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            {role.description}
                          </p>

                          {role.typicalSalaryRange && (
                            <div className="flex items-center gap-2 text-sm mb-4">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="font-semibold text-green-600">
                                {role.typicalSalaryRange}
                              </span>
                              <span className="text-muted-foreground">typical salary</span>
                            </div>
                          )}

                          <Button className="w-full" asChild>
                            <a href="/jobs?role=${encodeURIComponent(role.title)}">
                              View {role.title} Jobs
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Select Your Military Trade</h3>
                <p className="text-muted-foreground max-w-md">
                  Choose your military occupation from the list on the left or search for it above
                  to see your best civilian career matches.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Info Footer */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How This Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            <strong>Match Percentage:</strong> Shows how well your military experience translates to each civilian role.
            90%+ means your skills are directly applicable with minimal additional training.
          </p>
          <p>
            <strong>Transferable Skills:</strong> These are the civilian terms employers use for your military capabilities.
            Use these keywords in your resume and job applications.
          </p>
          <p>
            <strong>In Demand:</strong> These roles are actively hiring across Canada, with strong job growth projections.
          </p>
          <p>
            <strong>Salary Ranges:</strong> Based on Canadian market data for mid-level positions. Your specific salary
            will depend on experience, location, and employer.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
