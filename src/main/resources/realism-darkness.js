function initializeCoreMod() {
	op = Java.type("org.objectweb.asm.Opcodes");

	ASMAPI = Java.type("net.minecraftforge.coremod.api.ASMAPI");
	AbstractInsnNode = Java.type("org.objectweb.asm.tree.AbstractInsnNode");
	ClassNode = Java.type("org.objectweb.asm.tree.ClassNode");
	FieldInsnNode = Java.type("org.objectweb.asm.tree.FieldInsnNode");
	InsnList = Java.type("org.objectweb.asm.tree.InsnList");
	InsnNode = Java.type("org.objectweb.asm.tree.InsnNode");
	JumpInsnNode = Java.type("org.objectweb.asm.tree.JumpInsnNode");
	LabelNode = Java.type("org.objectweb.asm.tree.LabelNode");
	LdcInsnNode = Java.type("org.objectweb.asm.tree.LdcInsnNode");
	MethodInsnNode = Java.type("org.objectweb.asm.tree.MethodInsnNode");
	MethodNode = Java.type("org.objectweb.asm.tree.MethodNode");
	VarInsnNode = Java.type("org.objectweb.asm.tree.VarInsnNode");

	return {
		"NetherDimension#generateLightBrightnessTable": {
			"target": {
				"type": "METHOD",
				"class": "net.minecraft.world.dimension.NetherDimension",
				"methodName": "func_76556_a",
				"methodDesc": "()V"
			},
			"transformer": function(methodNode) {
				var inject = new InsnList();
				var l1 = new LabelNode();
				inject.add(new MethodInsnNode(op.INVOKESTATIC, "com/github/mikealy/realismdarkness/handler/AsmHandler", "stopNetherLight", "()Z", false));
				inject.add(new JumpInsnNode(op.IFEQ, l1));
				inject.add(new VarInsnNode(op.ALOAD, 0));
				inject.add(new MethodInsnNode(op.INVOKESPECIAL, "net/minecraft/world/dimension/Dimension", ASMAPI.mapMethod("func_76556_a"), "()V", false));
				inject.add(l1);
				methodNode.instructions.insert(firstInstruction(methodNode.instructions), inject);
				print("Injected nether light handler")
				return methodNode;
			}
		},
		"World#getSunBrightnessBody": {
			"target": {
				"type": "METHOD",
				"class": "net.minecraft.world.World",
				"methodName": "getSunBrightnessBody",
				"methodDesc": "(F)F"
			},
			"transformer": function(methodNode) {
				var activate2Power = false;
				var add = 0.2;
				var mult = 0.8;
				for (var i = 0; i < methodNode.instructions.size(); i++) {
					var an = methodNode.instructions.get(i);
					if (typeof(an) == LdcInsnNode) {
						if (an.cst.toFixed(1) == mult) {
							methodNode.instructions.set(an, new MethodInsnNode(op.INVOKESTATIC, "com/github/mikealy/realismdarkness/handler/AsmHandler", "sky1", "()F", false));
							print("Patched minimal sky light (1/2)");
							activate2Power = true;
						}
						else if (activate2Power && an.cst.toFixed(1) == add) {
							methodNode.instructions.set(an, new MethodInsnNode(op.INVOKESTATIC, "com/github/mikealy/realismdarkness/handler/AsmHandler", "sky2", "()F", false));
							print("Patched minimal sky light (2/2)");
						}
					}
				}
			}
		},
		"GameRenderer": {
			"target": {
				"type": "METHOD",
				"class": "net.minecraft.client.renderer.GameRenderer",
				"methodName": "func_78472_g",
				"methodDesc": "(F)V"
			},
			"transformer": function(methodNode) {
				var m0 = 0.95;
				var m3 = 0.96;

				var a0 = 0.05;
				var a3 = 0.03;

				var potion = false;
				for (var i = 0; i < methodNode.instructions.size(); i++) {
					var an = methodNode.instructions.get(i);
					if (typeof(an) == LdcInsnNode) {
						if (!potion) {
							if (an.cst.toFixed(2) == m0 || an.cst.toFixed(2) == m3) {
								methodNode.instructions.insert(an, new MethodInsnNode(op.INVOKESTATIC, "com/github/mikealy/realismdarkness/handler/AsmHandler", "up", "(F)F", false));
							}
							else if (an.cst.toFixed(2) == a0 || an.cst.toFixed(2) == a3) {
								methodNode.instructions.insert(an, new MethodInsnNode(op.INVOKESTATIC, "com/github/mikealy/realismdarkness/handler/AsmHandler", "down", "(F)F", false));
							}
						}
					}
					else if (typeof(an) == MethodInsnNode) {
						if (an.name.equals(ASMAPI.mapMethod("func_70644_a"))) {
							var insertAfter = methodNode.instructions.get(i + 1);
							if (typeof(insertAfter) == JumpInsnNode) {
								var mod1 = 0.9;
								var mod2 = 0.1;
								var instructions = new InsnList();
								instructions.add(new VarInsnNode(op.FLOAD, 11));
								instructions.add(new LdcInsnNode(mod1));
								instructions.add(new InsnNode(op.FMUL));
								instructions.add(new LdcInsnNode(mod2));
								instructions.add(new InsnNode(op.FADD));
								instructions.add(new VarInsnNode(op.FSTORE, 11));

								instructions.add(new VarInsnNode(op.FLOAD, 12));
								instructions.add(new LdcInsnNode(mod1));
								instructions.add(new InsnNode(op.FMUL));
								instructions.add(new LdcInsnNode(mod2));
								instructions.add(new InsnNode(op.FADD));
								instructions.add(new VarInsnNode(op.FSTORE, 12));

								instructions.add(new VarInsnNode(op.FLOAD, 13));
								instructions.add(new LdcInsnNode(mod1));
								instructions.add(new InsnNode(op.FMUL));
								instructions.add(new LdcInsnNode(mod2));
								instructions.add(new InsnNode(op.FADD));
								instructions.add(new VarInsnNode(op.FSTORE, 13));

								methodNode.instructions.insert(insertAfter, instructions);
								print("Patched Nightvision Potion");
								i += 18;
							}
						}
						else if (an.name.equals(ASMAPI.mapMethod("func_186068_a"))) {
							var toInsert = new InsnList();
							var l0 = new LabelNode(new Label());
							toInsert.add(new MethodInsnNode(op.INVOKESTATIC, "com/github/mikealy/realismdarkness/handler/AsmHandler", "stopEndLight", "()Z", false));
							toInsert.add(new JumpInsnNode(op.IFEQ, l0));
							toInsert.add(new InsnNode(op.POP));
							toInsert.add(new InsnNode(op.ICONST_0));
							toInsert.add(l0);

							methodNode.instructions.insert(methodNode.instructions.get(i), toInsert);
							print("Patched End Light Removal");
						}
						else if (an.name.equals(ASMAPI.mapmethod("func_110564_a"))) {
							var toInsert = new InsnList();

							toInsert.add(new VarInsnNode(op.ALOAD, 0));
							toInsert.add(new VarInsnNode(op.ALOAD, 0));
							toInsert.add(new FieldInsnNode(op.GETFIELD, "net/minecraft/client/renderer/EntityRenderer", ASMAPI.mapField("field_78504_Q"), "[I"));
							toInsert.add(new MethodInsnNode(op.INVOKESTATIC, "com/github/mikealy/realismdarkness/handler/AsmHandler", "modifyLightmap", "([I)[I", false));
							toInsert.add(new FieldInsnNode(op.PUTFIELD, "net/minecraft/client/renderer/EntityRenderer", ASMAPI.mapField("field_78504_Q"), "[I"));

							updateLightmap.instructions.insertBefore(an, toInsert);
							print("Patched Lightmap Manipulation");
							i += 5;
						}
					}
					else if (typeof(an) == FieldInsnNode) {

						if (an.name.equals(ASMAPI.mapfield("field_74333_Y"))) {
							updateLightmap.instructions.insert(an, new MethodInsnNode(Opcodes.INVOKESTATIC, "com/github/mikealy/realismdarkness/handler/AsmHandler", "overrideGamma", "(F)F", false));
						}
					}
				}

				print("Patched updateLightmap");
				return methodNode;
			}
		},
	}
}

function firstInstruction(instructions) {
	for (var i = 0; i < instructions.size(); i++) {
		var instruction = instructions.get(i);
		if (instruction.getType() == LABEL) {
			return instruction;
		}
	}
	throw "Couldn't find first instruction label of " + instruction.toString();
}