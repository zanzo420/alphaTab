//import org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget

plugins {
    kotlin("multiplatform")
    id("com.android.library")
}

group = "net.alphatab"
version = "1.3-SNAPSHOT"

kotlin {
    android()
//    ios {
//        binaries {
//            framework {
//                baseName = "alphaTab"
//            }
//        }
//    }

    jvm {
        compilations.all {
            kotlinOptions.jvmTarget = "11"
        }
        testRuns["test"].executionTask.configure {
            useJUnit()
        }
    }

    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.5.2")
            }
            kotlin.srcDirs("../../../dist/lib.kotlin/src")
        }

        val commonTest by getting {
            dependencies {
                implementation(kotlin("test-common"))
                implementation(kotlin("test-annotations-common"))
            }
            kotlin.srcDirs("../../../dist/lib.kotlin/test")
        }

        val jvmMain by getting {
            kotlin.srcDirs("src/jvmCommonMain/kotlin")
            dependencies {
                // TODO: check with Skija devs to have a platform independent lib
                implementation("org.jetbrains.skija:skija-windows:0.93.4")
            }
            resources.srcDirs("../../../font/").apply {
                this.filter.include("**/*.ttf")
                this.filter.include("**/*.sf2")
            }
        }

        val jvmTest by getting {
            //kotlin.srcDirs("src/jvmCommonTest")
            dependencies {
                implementation(kotlin("test"))
                implementation(kotlin("test-junit"))
                implementation("junit:junit:4.13.2")
            }
        }

        val androidMain by getting {
            kotlin.srcDirs("src/jvmCommonMain/kotlin")
            dependencies {
                implementation("androidx.core:core-ktx:1.7.0")
                implementation("androidx.appcompat:appcompat:1.4.0")
                implementation("com.google.android.material:material:1.4.0")
                implementation("androidx.recyclerview:recyclerview:1.2.1")
                implementation("com.google.android.flexbox:flexbox:3.0.0")
            }
        }
        val androidTest by getting {
            dependencies {
//                implementation(kotlin("test"))
                implementation(kotlin("test-junit"))
                implementation("junit:junit:4.13.2")
            }
        }

//        val iosMain by getting
//        val iosTest by getting

    }
}

android {
    compileSdk = 31
    sourceSets["main"].manifest.srcFile("src/androidMain/AndroidManifest.xml")
    sourceSets["main"].assets.srcDirs(
        "../../../font/bravura",
        "../../../font/sonivox"
    )
    sourceSets["androidTest"].manifest.srcFile("src/androidTest/AndroidManifest.xml")
    sourceSets["androidTest"].assets.srcDirs(
        "../../../test-data/",
        "../../../font/bravura",
        "../../../font/roboto",
        "../../../font/ptserif"
    )
    androidResources {
        ignoreAssetsPattern = arrayOf(
            "eot",
            "otf",
            "svg",
            "woff",
            "woff2",
            "json",
            "txt"
        ).joinToString(":") { "!*.${it}" }
    }

    defaultConfig {
        minSdk = 24
        targetSdk = 31
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }
}

val fetchTestResultsTask by tasks.registering {
    group = "reporting"
    doLast {
        exec {
            executable = android.adbExecutable.toString()
            args = listOf(
                "pull",
                "/storage/emulated/0/Documents/test-results",
                "$buildDir/reports/androidTests/connected/"
            )
        }
    }
}

tasks.whenTaskAdded {
    if (this.name == "connectedDebugAndroidTest") {
        this.finalizedBy(fetchTestResultsTask)
    }
}

// TODO: remove assertions for faster library.
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
    kotlinOptions {
        freeCompilerArgs = listOf(
            "-Xno-call-assertions",
            "-Xno-receiver-assertions",
            "-Xno-param-assertions"
        )
    }
}

//val packForXcode by tasks.creating(Sync::class) {
//    group = "build"
//    val mode = System.getenv("CONFIGURATION") ?: "DEBUG"
//    val sdkName = System.getenv("SDK_NAME") ?: "iphonesimulator"
//    val targetName = "ios" + if (sdkName.startsWith("iphoneos")) "Arm64" else "X64"
//    val framework =
//        kotlin.targets.getByName<KotlinNativeTarget>(targetName).binaries.getFramework(mode)
//    inputs.property("mode", mode)
//    dependsOn(framework.linkTask)
//    val targetDir = File(buildDir, "xcode-frameworks")
//    from({ framework.outputDirectory })
//    into(targetDir)
//}
//
//tasks.getByName("build").dependsOn(packForXcode)
