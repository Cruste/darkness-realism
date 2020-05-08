package com.github.mikealy.realismdarkness.config;

import org.apache.commons.lang3.tuple.Pair;

import net.minecraftforge.common.ForgeConfigSpec;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod.EventBusSubscriber;
import net.minecraftforge.fml.config.ModConfig;

import com.github.mikealy.realismdarkness.RealismDarkness;

@EventBusSubscriber(modid = RealismDarkness.MOD_ID, bus = EventBusSubscriber.Bus.MOD)
public class RealismDarknessConfig {
	public static final ClientConfig CLIENT;
	public static final ForgeConfigSpec CLIENT_SPEC;
	static {
		final Pair<ClientConfig, ForgeConfigSpec> specPair = new ForgeConfigSpec.Builder().configure(ClientConfig::new);
		CLIENT_SPEC = specPair.getRight();
		CLIENT = specPair.getLeft();
	}

	public static int mode;
	public static boolean darkNether;
	public static boolean darkEnd;
	public static boolean darkTwilightForest;
	public static boolean alternativeNightSky;
	public static double gammaOverride;
	public static double moonlightMultiplier;
	

	@SubscribeEvent
	public static void onModConfigEvent(final ModConfig.ModConfigEvent configEvent) {
		if (configEvent.getConfig().getSpec() == RealismDarknessConfig.CLIENT_SPEC) {
			bakeConfig();
		}
	}

	public static void bakeConfig() {
		mode = CLIENT.mode.get();
		darkNether = CLIENT.darkNether.get();
		darkEnd = CLIENT.darkEnd.get();
		darkTwilightForest = CLIENT.darkTwilightForest.get();
	}

	public static class ClientConfig {
		public final ForgeConfigSpec.IntValue mode;
		public final ForgeConfigSpec.BooleanValue darkNether;
		public final ForgeConfigSpec.BooleanValue darkEnd;
		public final ForgeConfigSpec.BooleanValue darkTwilightForest;
		public final ForgeConfigSpec.BooleanValue alternativeNightSky;
		public final ForgeConfigSpec.DoubleValue gammaOverride;
		public final ForgeConfigSpec.DoubleValue moonlightMultiplier;

		public ClientConfig(ForgeConfigSpec.Builder builder) {
			mode = builder
					.comment("Display darkness mode: 0: No minimum sky & block light, 1: No minimum block light, 2: Skylight is dependent on moon phase")
					.translation(RealismDarkness.MOD_ID + ".config." + "mode")
					.defineInRange("mode", 0, 0, 2);
			darkNether = builder
					.comment("Should the Nether have its minimum light removed")
					.translation(RealismDarkness.MOD_ID + ".config." + "darkNether")
					.define("darkNether", true);
			darkEnd = builder
					.comment("Should the End have its minimum light removed")
					.translation(RealismDarkness.MOD_ID + ".config." + "darkEnd")
					.define("darkEnd", false);
			darkTwilightForest = builder
					.comment("Should the Twilight Forest have its minimum light removed")
					.translation(RealismDarkness.MOD_ID + ".config." + "darkTwilightForest")
					.define("darkTwilightForest", true);
			alternativeNightSky = builder
					.comment("Should the night sky in modes 1 and 2 be changed to a greener colour")
					.translation(RealismDarkness.MOD_ID + ".config." + "alternativeNightSky")
					.define("alternativeNightSky", true);
			gammaOverride = builder
					.comment("Lock the sky brightness to some value between 0 and 1, -1 to disable")
					.translation(RealismDarkness.MOD_ID + ".config." + "gammaOverride")
					.defineInRange("gammaOverride", -1D, -1D, 1D);
			moonlightMultiplier = builder
					.comment("Set the maximum moon brightness to this multiple of the original brightness between 0 and 1 (Only applicable in mode 2)")
					.translation(RealismDarkness.MOD_ID + ".config." + "moonlightMultiplier")
					.defineInRange("moonlightMultiplier", 0.3D, 0D, 1D);
			
		}
	}
}

