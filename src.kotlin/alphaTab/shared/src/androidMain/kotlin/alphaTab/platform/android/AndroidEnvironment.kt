package alphaTab.platform.android

import alphaTab.Environment
import android.util.DisplayMetrics
import kotlin.contracts.ExperimentalContracts

public class AndroidEnvironment {
    companion object {
        private var _isInitialized: Boolean = false
        @ExperimentalUnsignedTypes
        @ExperimentalContracts
        public fun initializeAndroid(context:android.content.Context, displayMetrics:DisplayMetrics) {
            if(_isInitialized) {
                return;
            }
            _isInitialized = true

            Environment.HighDpiFactor = displayMetrics.density.toDouble()

            AndroidCanvas.initialize(context);
        }
    }
}
