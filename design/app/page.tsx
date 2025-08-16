import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Palette, Scissors, Layers, Sparkles, Wrench } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <ImageIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-foreground">Image Workshop</h1>
                <p className="text-sm text-muted-foreground font-sans">Digital Crafting Space</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="font-sans">
                Beta
              </Badge>
              <Button variant="outline" className="font-sans bg-transparent">
                Sign In
              </Button>
              <Button className="font-sans">Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 workshop-texture">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl font-serif font-bold text-foreground mb-6">
              Craft Your Vision with
              <span className="text-primary"> Digital Precision</span>
            </h2>
            <p className="text-xl text-muted-foreground font-sans leading-relaxed mb-8">
              Where traditional craftsmanship meets modern image editing. Transform your ideas into stunning visuals
              with our intuitive workshop-inspired tools.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" className="font-sans px-8">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Creating
              </Button>
              <Button variant="outline" size="lg" className="font-sans px-8 bg-transparent">
                View Gallery
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif font-bold text-foreground mb-4">Your Digital Workshop Tools</h3>
            <p className="text-lg text-muted-foreground font-sans max-w-2xl mx-auto">
              Each tool is crafted with precision and designed for intuitive use, bringing the feel of a traditional
              workshop to your digital canvas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Palette,
                title: "Color Mixer",
                description: "Blend and adjust colors with the precision of a master painter's palette.",
              },
              {
                icon: Scissors,
                title: "Smart Crop",
                description: "Cut and trim your images with the accuracy of fine craftsmanship tools.",
              },
              {
                icon: Layers,
                title: "Layer Forge",
                description: "Build complex compositions layer by layer, like assembling fine woodwork.",
              },
              {
                icon: Wrench,
                title: "Adjustment Bench",
                description: "Fine-tune every aspect of your image with workshop-grade precision.",
              },
              {
                icon: ImageIcon,
                title: "Filter Workshop",
                description: "Apply artistic effects with the care of a traditional artisan.",
              },
              {
                icon: Sparkles,
                title: "Enhancement Studio",
                description: "Polish your work to perfection with professional-grade tools.",
              },
            ].map((tool, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <tool.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="font-serif text-lg">{tool.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="font-sans text-muted-foreground leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-serif font-bold text-foreground mb-4">Ready to Start Crafting?</h3>
            <p className="text-lg text-muted-foreground font-sans mb-8">
              Join thousands of creators who have made Image Workshop their go-to digital crafting space.
            </p>
            <Button size="lg" className="font-sans px-12">
              Launch Workshop
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
                <ImageIcon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif font-semibold text-foreground">Image Workshop</span>
            </div>
            <p className="text-sm text-muted-foreground font-sans">© 2025 Image Workshop. Crafted with precision.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
