using System.Reflection;
using System.Runtime.Loader;
using Jellyfin.Plugin.PlaybackFilters.Configuration;
using MediaBrowser.Common.Configuration;
using MediaBrowser.Common.Plugins;
using MediaBrowser.Model.Serialization;
using Newtonsoft.Json.Linq;

namespace Jellyfin.Plugin.PlaybackFilters;

/// <summary>
/// Registers the playback filter client script with JavaScript Injector.
/// </summary>
public sealed class Plugin : BasePlugin<PluginConfiguration>
{
    /// <summary>
    /// Initializes a new instance of the <see cref="Plugin"/> class.
    /// </summary>
    public Plugin(IApplicationPaths applicationPaths, IXmlSerializer xmlSerializer)
        : base(applicationPaths, xmlSerializer)
    {
        Instance = this;
    }

    /// <inheritdoc />
    public override string Name => "Playback Filters";

    /// <inheritdoc />
    public override Guid Id => Guid.Parse("584fa16c-e558-4ae5-a02b-bbfbfe16dd03");

    /// <summary>
    /// Gets the active plugin instance.
    /// </summary>
    public static Plugin? Instance { get; private set; }

    /// <summary>
    /// Registers the embedded client script.
    /// </summary>
    public void RegisterClientScript()
    {
        try
        {
            Assembly? injectorAssembly = AssemblyLoadContext.All
                .SelectMany(context => context.Assemblies)
                .FirstOrDefault(assembly => assembly.FullName?.Contains(
                    "Jellyfin.Plugin.JavaScriptInjector",
                    StringComparison.Ordinal) ?? false);

            Type? interfaceType = injectorAssembly?.GetType("Jellyfin.Plugin.JavaScriptInjector.PluginInterface");
            if (interfaceType is null)
            {
                return;
            }

            const string resourceName = "Jellyfin.Plugin.PlaybackFilters.Web.playback-filters.js";
            using Stream? stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName);
            if (stream is null)
            {
                return;
            }

            using var reader = new StreamReader(stream);
            var payload = new JObject
            {
                { "id", $"{Id}-client-script" },
                { "name", "Playback Filters Client Script" },
                { "script", reader.ReadToEnd() },
                { "enabled", true },
                { "requiresAuthentication", true },
                { "pluginId", Id.ToString() },
                { "pluginName", Name },
                { "pluginVersion", Version.ToString() }
            };

            interfaceType.GetMethod("RegisterScript")?.Invoke(null, new object[] { payload });
        }
        catch
        {
            // The standalone injector-script installation remains available if registration fails.
        }
    }

    /// <inheritdoc />
    public override void OnUninstalling()
    {
        try
        {
            Assembly? injectorAssembly = AssemblyLoadContext.All
                .SelectMany(context => context.Assemblies)
                .FirstOrDefault(assembly => assembly.FullName?.Contains(
                    "Jellyfin.Plugin.JavaScriptInjector",
                    StringComparison.Ordinal) ?? false);

            Type? interfaceType = injectorAssembly?.GetType("Jellyfin.Plugin.JavaScriptInjector.PluginInterface");
            interfaceType?.GetMethod("UnregisterAllScriptsFromPlugin")?.Invoke(null, new object[] { Id.ToString() });
        }
        catch
        {
            // Do not block plugin uninstall if JavaScript Injector is unavailable.
        }

        base.OnUninstalling();
    }
}
