import Layer from "./Layer.js";

export const MARS_LAYERS = {
    high_res_gray: new Layer(
        "https://trek.nasa.gov/tiles/Mars/EQ/msss_atlas_simp_clon/1.0.0/WMTSCapabilities.xml",
        "Grey",
    ),
    roughness: new Layer("https://trek.nasa.gov/tiles/Mars/EQ/mola_roughness/1.0.0/WMTSCapabilities.xml", "Roughness"),
    thermal_intertia: new Layer(
        "https://trek.nasa.gov/tiles/Mars/EQ/TES_Thermal_Inertia/1.0.0/WMTSCapabilities.xml",
        "Thermal Intertia",
    ),
    dust: new Layer("https://trek.nasa.gov/tiles/Mars/EQ/tes_ruffdust/1.0.0/WMTSCapabilities.xml", "Dust"),
    elevation: new Layer(
        "https://trek.nasa.gov/tiles/Mars/EQ/Mars_MOLA_blend200ppx_HRSC_ClrShade_clon0dd_200mpp_lzw/1.0.0/WMTSCapabilities.xml",
        "Elevation",
    ),
    color: new Layer(
        "https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/WMTSCapabilities.xml",
        "Colour",
    ),
};
