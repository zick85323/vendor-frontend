import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-slate-800 mb-8">
          BIBUAIN Platform
        </h1>
        <div className="space-y-4">
          <p className="text-slate-600 max-w-md mx-auto mb-6">
            Welcome to the BIBUAIN cryptocurrency trading platform. Access the
            coin exchange module to manage your cryptocurrency transactions.
          </p>
          <Link to="/coin-exchange">
            <Button className="bg-amber-500 hover:bg-amber-600">
              Go to Coin Exchange
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
