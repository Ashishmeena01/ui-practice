import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import "./App.css"

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasRefMsg = useRef<HTMLCanvasElement | null>(null)
  const [text, setText] = useState("")


  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x020617, 3.5, 8)

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000)
    camera.position.set(0, 0.3, 4.5)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const ambientLight = new THREE.AmbientLight(0x9ec5ff, 1.1)
    scene.add(ambientLight)

    const sunlight = new THREE.DirectionalLight(0xffffff, 1.8)
    sunlight.position.set(2, 1.5, 3)
    scene.add(sunlight)

    const earthGroup = new THREE.Group()
    scene.add(earthGroup)

    const textureCanvas = document.createElement("canvas")
    textureCanvas.width = 1024
    textureCanvas.height = 512
    const textureContext = textureCanvas.getContext("2d")

    if (textureContext) {
      const oceanGradient = textureContext.createLinearGradient(0, 0, 1024, 512)
      oceanGradient.addColorStop(0, "#0f172a")
      oceanGradient.addColorStop(0.5, "#1d4ed8")
      oceanGradient.addColorStop(1, "#0ea5e9")
      textureContext.fillStyle = oceanGradient
      textureContext.fillRect(0, 0, 1024, 512)

      const continents = [
        { x: 130, y: 150, w: 220, h: 90 },
        { x: 420, y: 110, w: 190, h: 80 },
        { x: 610, y: 165, w: 250, h: 90 },
        { x: 820, y: 120, w: 160, h: 70 },
        { x: 760, y: 260, w: 180, h: 80 },
      ]

      textureContext.fillStyle = "#22c55e"
      continents.forEach(({ x, y, w, h }) => {
        textureContext.beginPath()
        textureContext.moveTo(x, y + h * 0.3)
        textureContext.bezierCurveTo(x + w * 0.15, y, x + w * 0.55, y, x + w, y + h * 0.25)
        textureContext.bezierCurveTo(x + w * 0.9, y + h * 0.8, x + w * 0.55, y + h, x + w * 0.3, y + h)
        textureContext.bezierCurveTo(x + w * 0.08, y + h * 0.85, x, y + h * 0.55, x, y + h * 0.3)
        textureContext.closePath()
        textureContext.fill()
      })

      textureContext.fillStyle = "rgba(255,255,255,0.2)"
      for (let i = 0; i < 70; i += 1) {
        const cloudX = Math.random() * 1024
        const cloudY = Math.random() * 512
        const cloudW = 80 + Math.random() * 120
        const cloudH = 20 + Math.random() * 30
        textureContext.beginPath()
        textureContext.ellipse(cloudX, cloudY, cloudW, cloudH, 0, 0, Math.PI * 2)
        textureContext.fill()
      }
    }

    const earthTexture = new THREE.CanvasTexture(textureCanvas)
    earthTexture.colorSpace = THREE.SRGBColorSpace

    const earthGeometry = new THREE.SphereGeometry(1.1, 64, 64)
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.9,
      metalness: 0.08,
    })
    const earth = new THREE.Mesh(earthGeometry, earthMaterial)
    earthGroup.add(earth)

    const starsGeometry = new THREE.BufferGeometry()
    const starsCount = 1800
    const starsPositions = new Float32Array(starsCount * 3)

    for (let i = 0; i < starsCount; i += 1) {
      const i3 = i * 3
      starsPositions[i3] = (Math.random() - 0.5) * 20
      starsPositions[i3 + 1] = (Math.random() - 0.5) * 20
      starsPositions[i3 + 2] = (Math.random() - 0.5) * 20
    }

    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starsPositions, 3))
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xe2e8f0,
      size: 0.04,
      transparent: true,
      opacity: 0.9,
    })
    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)

    const resize = () => {
      const width = canvas.clientWidth - 40
      const height = canvas.clientHeight - 40

      if (!width || !height) {
        return
      }

      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    resize()

    let animationFrameId = 0

    const animate = () => {
      earthGroup.rotation.y += 0.004
      earth.rotation.y -= 0.006
      stars.rotation.y -= 0.0004
      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)
    window.addEventListener("resize", resize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", resize)
      earthGeometry.dispose()
      earthMaterial.dispose()
      earthTexture.dispose()
      starsGeometry.dispose()
      starsMaterial.dispose()
      renderer.dispose()
    }
  }, [])


  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000)
    camera.position.set(0, 0.3, 4.5)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const paperGeometery = new THREE.PlaneGeometry();
    // const paper

  }, [])



  return (
    <main className="flex h-screen w-full flex-col items-center justify-center gap-8  text-black">
      <canvas
        ref={canvasRef}
        className="z-0 top-0 absolute h-[min(50vw,500px)] w-[min(50vw,600px)] rounded-xl "
      />

      <div className="w-full h-full flex items-center justify-center flex-col">
        <div className="w-1/6 flex top-1/2  shadow z-10 absolute bg-black text-wrap text-black"><div className="text-wrap">{text}</div></div>

        <form className="z-10 relative mt-96 w-1/2 rounded-[28px] border border-white/10 bg-white/5 p-3 shadow-[0_24px_60px_rgba(14,165,233,0.2)] backdrop-blur-xl">
          <textarea
            onChange={(val) => {
              setText(val.target.value);
            }}
            rows={4}
            placeholder="Message ChatGPT..."
            className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-base text-white placeholder:text-slate-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30"
          />

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <button type="button" className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 transition hover:border-sky-400/50 hover:text-white">
                Ask
              </button>
              <button type="button" className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 transition hover:border-sky-400/50 hover:text-white">
                Explain
              </button>
            </div>

            <button
              type="submit"
              className="rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default App
